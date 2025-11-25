import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

export interface SearchResult {
  query: string;
  summary: string;
  sources: Source[];
}

export class SearchService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Performs a grounded search using Google Search Tool.
   * Returns a summary and the sources used.
   */
  async search(query: string): Promise<SearchResult> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Investigate the following topic and provide a concise factual summary based on real-world data: "${query}".`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const summary = response.text || "No summary available.";
      const sources: Source[] = [];

      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || "Web Source",
              uri: chunk.web.uri || "#",
            });
          }
        });
      }

      return {
        query,
        summary,
        sources,
      };
    } catch (error) {
      console.warn(`Search failed for query: "${query}"`, error);
      // Fallback gracioso conforme solicitado
      return {
        query,
        summary: "Search unavailable. Proceeding with internal knowledge.",
        sources: [],
      };
    }
  }
}

export const searchService = new SearchService();
