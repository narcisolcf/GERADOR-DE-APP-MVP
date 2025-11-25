// FIX: Removed import for 'FeatureScores' as it is no longer used.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // FIX: Updated the 'features' table definition to match the 'Funcionalidade' type.
      features: {
        Row: {
          id: string;
          project_id: string;
          titulo: string;
          descricao: string;
          tamanho_camiseta: 'P' | 'M' | 'G';
          risco: 'Alto' | 'Médio' | 'Baixo';
          valor_negocio: number;
          fator_uau: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          titulo: string;
          descricao: string;
          tamanho_camiseta: 'P' | 'M' | 'G';
          risco: 'Alto' | 'Médio' | 'Baixo';
          valor_negocio: number;
          fator_uau: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          titulo?: string;
          descricao?: string;
          valor_negocio?: number;
          fator_uau?: boolean;
          tamanho_camiseta?: 'P' | 'M' | 'G';
          risco?: 'Alto' | 'Médio' | 'Baixo';
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
