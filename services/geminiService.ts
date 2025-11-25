import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Feature, ImageGenerationConfig, AnalysisResult, Source } from "../types";
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
    contents: `Provide a 1-sentence ultra-fast technical feasibility check for: "${input}". Be direct and witty.`,
  });
  return response.text || "Insight unavailable.";
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
      systemInstruction: "You are a Senior Software Architect. Help the user refine their ideas, suggest patterns, and solve technical constraints. Be concise but deep.",
    },
  });
};

/**
 * RAG-based Analysis Flow:
 * 1. Generates 3 strategic search queries (Tech, Market, Compliance).
 * 2. Executes searches in parallel using SearchService.
 * 3. Injects facts into the LLM prompt to generate the JSON analysis.
 */
export const analyzeProjectRequirements = async (description: string): Promise<AnalysisResult> => {
  const ai = getAIClient();

  // 1. Define Search Vectors
  const queries = [
    `Technical feasibility and deprecated libraries for: ${description}`,
    `Market competitors and similar products for: ${description}`,
    `Legal compliance and regulations for: ${description}`
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
    `### FACT (${r.query})\n${r.summary}`
  ).join("\n\n");

  const allSources: Source[] = searchResults.flatMap(r => r.sources);
  // Deduplicate sources by URI
  const uniqueSources = Array.from(new Map(allSources.map(s => [s.uri, s])).values());

  // 4. Final Generation with Grounded Context
  const prompt = `
    Analyze the following project description and breakdown technical features.
    
    PROJECT: ${description}

    CONTEXTUAL FACTS (GROUNDING DATA):
    ${contextString}
    
    INSTRUCTIONS:
    - Use the provided facts to validate feasibility and risk.
    - If a technology mentioned in facts is deprecated, mark risk as 'Red'.
    - If competitors exist, mark 'valuable' based on differentiation.
    
    Return a JSON array of features matching the schema.
  `;

  // Schema definition for strict JSON output
  const featureSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        scores: {
          type: Type.OBJECT,
          properties: {
            valuable: { type: Type.BOOLEAN },
            usable: { type: Type.BOOLEAN },
            feasible: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            wow: { type: Type.BOOLEAN },
          },
          required: ["valuable", "usable", "feasible", "wow"]
        },
        size: { type: Type.STRING, enum: ["P", "M", "G"] },
        risk: { type: Type.STRING, enum: ["Red", "Yellow", "Green"] },
        type: { type: Type.STRING, enum: ["UI", "Logic", "Database"] },
      },
      required: ["id", "name", "description", "scores", "size", "risk", "type"]
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: featureSchema,
    }
  });

  let features: Feature[] = [];
  try {
    const text = response.text || "[]";
    features = JSON.parse(text) as Feature[];
    
    // Enrich with IDs if missing (safety net)
    features = features.map(f => ({
      ...f,
      id: f.id || crypto.randomUUID()
    }));

  } catch (e) {
    console.error("Failed to parse Analysis JSON", e);
    // Return empty to be handled by UI
  }

  return {
    features,
    groundingMetadata: {
      sources: uniqueSources,
      searchQueries: queries
    }
  };
};