import { Timestamp } from 'firebase/firestore';

export type Step = 'input' | 'analysis' | 'sequencer' | 'rtcf';

// --- NOVAS INTERFACES FIREBASE ---

export interface Projeto {
  id: string;
  usuario_id: string;
  nome_projeto: string;
  descricao_problema: string;
  data_criacao: Timestamp;
}

export interface Funcionalidade {
  id: string;
  projeto_id: string;
  titulo: string;
  descricao: string;
  tamanho_camiseta: 'P' | 'M' | 'G';
  risco: 'Alto' | 'Médio' | 'Baixo';
  valor_negocio: number; // Score de 1 a 10
  fator_uau: boolean;
}

// --- FIM NOVAS INTERFACES ---


export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  funcionalidades: Funcionalidade[]; // <-- ATUALIZADO
  groundingMetadata: {
    sources: Source[];
    searchQueries: string[];
  };
}

export interface SimulationState {
  step: Step;
  funcionalidades: Funcionalidade[]; // <-- ATUALIZADO
  selectedFuncionalidadeId: string | null; // <-- ATUALIZADO
  isProcessing: boolean;
  projectDescription: string;
  analysisSources: Source[];
  quickInsight: string | null;
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  size: ImageSize;
}

export interface Blueprint {
  id: string;
  timestamp: number;
  config: ImageGenerationConfig;
  imageBase64: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export type TabId = 'architecture' | 'algorithm' | 'simulation' | 'visual-architect';