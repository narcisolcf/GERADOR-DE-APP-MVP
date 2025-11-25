import { FeatureScores } from '../types';

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
      features: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string;
          scores: FeatureScores;
          size: 'P' | 'M' | 'G';
          risk: 'Red' | 'Yellow' | 'Green';
          type: 'UI' | 'Logic' | 'Database';
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description: string;
          scores: FeatureScores;
          size: 'P' | 'M' | 'G';
          risk: 'Red' | 'Yellow' | 'Green';
          type: 'UI' | 'Logic' | 'Database';
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string;
          scores?: FeatureScores;
          size?: 'P' | 'M' | 'G';
          risk?: 'Red' | 'Yellow' | 'Green';
          type?: 'UI' | 'Logic' | 'Database';
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