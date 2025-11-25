import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { funcionalidadeConverter } from '../lib/firestoreConverters';
import { analyzeProjectRequirements } from './geminiService';
import { Funcionalidade, AnalysisResult, Source } from '../types';

/**
 * Generates a list of suggested functionalities based on keyword heuristics.
 * This is a fallback for when the AI service is not used.
 * @param textoIdeia The user's project description.
 * @param projetoId The ID of the parent project.
 * @returns An array of Funcionalidade objects.
 */
const gerarFuncionalidadesPorHeuristica = (textoIdeia: string, projetoId: string): Funcionalidade[] => {
  const funcs: Funcionalidade[] = [];
  const lowerCaseText = textoIdeia.toLowerCase();

  const keywordMap: { [key: string]: { title: string; data: Omit<Funcionalidade, 'id' | 'projeto_id' | 'titulo'> } } = {
    'venda,comprar,marketplace,ecommerce,loja,carrinho': {
      title: 'Carrinho de Compras',
      data: {
        descricao: 'Permite que os usuários adicionem produtos a um carrinho e finalizem a compra.',
        tamanho_camiseta: 'G',
        risco: 'Médio',
        valor_negocio: 10,
        fator_uau: false,
      },
    },
    'nft,carteira,web3,metamask,blockchain': {
      title: 'Conexão de Carteira Web3',
      data: {
        descricao: 'Autenticação e interação com o sistema através de uma carteira digital Web3.',
        tamanho_camiseta: 'M',
        risco: 'Baixo',
        valor_negocio: 9,
        fator_uau: true,
      },
    },
    'usuário,login,perfil,autenticação,conta': {
      title: 'Autenticação de Usuários',
      data: {
        descricao: 'Sistema de cadastro, login e gerenciamento de perfil para usuários.',
        tamanho_camiseta: 'M',
        risco: 'Baixo',
        valor_negocio: 8,
        fator_uau: false,
      },
    },
    'galeria,exibir,artes,produtos,lista': {
      title: 'Galeria de Itens',
      data: {
        descricao: 'Uma interface para visualizar todos os itens ou produtos disponíveis.',
        tamanho_camiseta: 'M',
        risco: 'Baixo',
        valor_negocio: 9,
        fator_uau: false,
      },
    },
    'leilão,lance': {
      title: 'Sistema de Leilão',
      data: {
        descricao: 'Implementa a lógica de lances, tempo de expiração e transferência do ativo on-chain.',
        tamanho_camiseta: 'G',
        risco: 'Alto',
        valor_negocio: 10,
        fator_uau: true,
      },
    }
  };

  const addedTitles = new Set<string>();

  for (const keywords in keywordMap) {
    const { title, data } = keywordMap[keywords];
    if (keywords.split(',').some(k => lowerCaseText.includes(k))) {
        if (!addedTitles.has(title)) {
            funcs.push({
                id: crypto.randomUUID(),
                projeto_id: projetoId,
                titulo: title,
                ...data,
            });
            addedTitles.add(title);
        }
    }
  }

  // If no keywords matched, add a generic one
  if (funcs.length === 0) {
    funcs.push({
      id: crypto.randomUUID(),
      projeto_id: projetoId,
      titulo: 'Funcionalidade Principal',
      descricao: 'Funcionalidade central baseada na descrição do projeto.',
      tamanho_camiseta: 'M',
      risco: 'Médio',
      valor_negocio: 10,
      fator_uau: false,
    });
  }

  return funcs.slice(0, 3); // Limit to 3 suggestions
};


/**
 * Analyzes a project idea, generates a list of functionalities for an MVP,
 * and saves them to Firestore.
 * @param projetoId The ID of the project to associate the functionalities with.
 * @param textoIdeia The user's raw project idea description.
 * @param usarIA A boolean flag to determine whether to use the Gemini AI or a local heuristic.
 * @returns An object containing the list of functionalities and any grounding sources.
 */
export const analisarGerarMVP = async (
    projetoId: string,
    textoIdeia: string,
    usarIA: boolean
): Promise<{ funcionalidades: Funcionalidade[], sources: Source[] }> => {
    
    let analysisResult: AnalysisResult;

    if (usarIA) {
        analysisResult = await analyzeProjectRequirements(textoIdeia, projetoId);
    } else {
        const funcs = gerarFuncionalidadesPorHeuristica(textoIdeia, projetoId);
        analysisResult = { 
            funcionalidades: funcs, 
            groundingMetadata: { sources: [], searchQueries: [] } 
        };
    }
    
    // Only persist if Firebase is configured and we're not in a pure demo call
    if (analysisResult.funcionalidades.length > 0 && db && projetoId !== 'demo-project-id') {
        const batch = writeBatch(db);
        const funcsCollection = collection(db, 'funcionalidades').withConverter(funcionalidadeConverter);
        
        analysisResult.funcionalidades.forEach(func => {
            const finalFunc = { ...func, id: func.id || crypto.randomUUID(), projeto_id: projetoId };
            const docRef = doc(funcsCollection, finalFunc.id);
            batch.set(docRef, finalFunc);
        });

        await batch.commit();
    }

    return { 
        funcionalidades: analysisResult.funcionalidades,
        sources: analysisResult.groundingMetadata.sources
    };
};
