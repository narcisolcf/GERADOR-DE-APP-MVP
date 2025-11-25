export type Step = 'input' | 'analysis' | 'sequencer' | 'rtcf';

export interface FeatureScores {
  valuable: boolean;
  usable: boolean;
  feasible: 'High' | 'Medium' | 'Low';
  wow: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  scores: FeatureScores;
  size: 'P' | 'M' | 'G';
  risk: 'Red' | 'Yellow' | 'Green';
  type: 'UI' | 'Logic' | 'Database';
}

export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  features: Feature[];
  groundingMetadata: {
    sources: Source[];
    searchQueries: string[];
  };
}

export interface SimulationState {
  step: Step;
  features: Feature[];
  selectedFeatureId: string | null;
  isProcessing: boolean;
  projectDescription: string;
  analysisSources: Source[];
  quickInsight: string | null; // Added for Flash-Lite response
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