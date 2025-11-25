import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Funcionalidade, ImageGenerationConfig, AnalysisResult, Source } from "../types";
import { searchService, SearchResult } from "./searchService";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateArchitecturalImage = async (config: ImageGenerationConfig): Promise<string> => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: config.prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
};

/**
 * Fast AI Response using Gemini Flash-Lite.
 * Provides low-latency feedback on ideas.
 */
export const getQuickInsight = async (input: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `Forneça uma análise de viabilidade técnica ultra-rápida de 1 frase para: "${input}". Seja direto, em português.`,
  });
  return response.text || "Insight indisponível.";
};

/**
 * Initializes a Chat Session using Gemini 3 Pro.
 * Optimized for complex reasoning and architectural advice.
 */
export const createArchitectChatSession = (): Chat => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Você é um Arquiteto de Software Sênior. Ajude o usuário a refinar suas ideias, sugira padrões e resolva restrições técnicas. Seja conciso, mas profundo. Responda em português.",
    },
  });
};

/**
 * RAG-based Analysis Flow:
 * 1. Generates 3 strategic search queries (Tech, Market, Compliance).
 * 2. Executes searches in parallel using SearchService.
 * 3. Injects facts into the LLM prompt to generate the JSON analysis.
 */
export const analyzeProjectRequirements = async (description: string, projetoId: string): Promise<AnalysisResult> => {
  const ai = getAIClient();

  // 1. Define Search Vectors
  const queries = [
    `Viabilidade técnica e bibliotecas depreciadas para: ${description}`,
    `Concorrentes de mercado e produtos similares para: ${description}`,
    `Regulamentações e compliance legal para: ${description}`
  ];

  // 2. Parallel Execution (RAG Retrieval)
  let searchResults: SearchResult[] = [];
  try {
    searchResults = await Promise.all(
      queries.map(q => searchService.search(q))
    );
  } catch (e) {
    console.error("RAG Retrieval failed, proceeding with fallback", e);
  }

  // 3. Construct Context from Retrieval
  const contextString = searchResults.map(r => 
    `### FATO (${r.query})\n${r.summary}`
  ).join("\n\n");

  const allSources: Source[] = searchResults.flatMap(r => r.sources);
  // Deduplicate sources by URI
  const uniqueSources = Array.from(new Map(allSources.map(s => [s.uri, s])).values());

  // 4. Final Generation with Grounded Context
  const prompt = `
    Analise a seguinte descrição de projeto e detalhe as funcionalidades técnicas em português.
    
    PROJETO: ${description}

    FATOS CONTEXTUAIS (DADOS DE APOIO):
    ${contextString}
    
    INSTRUÇÕES:
    - Use os fatos para validar viabilidade e risco.
    - Se uma tecnologia mencionada nos fatos for depreciada, marque o risco como 'Alto'.
    - Se existirem concorrentes, avalie o 'valor_negocio' com base na diferenciação.
    
    Retorne um array JSON de funcionalidades que corresponda ao schema.
  `;

  // Schema definition for strict JSON output
  const funcionalidadeSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "Um UUID aleatório para a funcionalidade." },
        projeto_id: { type: Type.STRING, description: `ID do projeto ao qual pertence (usar '${projetoId}').` },
        titulo: { type: Type.STRING },
        descricao: { type: Type.STRING },
        tamanho_camiseta: { type: Type.STRING, enum: ["P", "M", "G"] },
        risco: { type: Type.STRING, enum: ["Alto", "Médio", "Baixo"] },
        valor_negocio: { type: Type.NUMBER, description: "Um score de 1 a 10 para o valor de negócio percebido." },
        fator_uau: { type: Type.BOOLEAN, description: "Se esta funcionalidade surpreenderia positivamente o usuário." },
      },
      required: ["id", "projeto_id", "titulo", "descricao", "tamanho_camiseta", "risco", "valor_negocio", "fator_uau"]
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: funcionalidadeSchema,
    }
  });

  let funcionalidades: Funcionalidade[] = [];
  try {
    const text = response.text || "[]";
    funcionalidades = JSON.parse(text) as Funcionalidade[];
    
    // Enrich with IDs if missing (safety net)
    funcionalidades = funcionalidades.map(f => ({
      ...f,
      id: f.id || crypto.randomUUID(),
      projeto_id: f.projeto_id || projetoId,
    }));

  } catch (e) {
    console.error("Failed to parse Analysis JSON", e);
    // Return empty to be handled by UI
  }

  return {
    funcionalidades,
    groundingMetadata: {
      sources: uniqueSources,
      searchQueries: queries
    }
  };
};