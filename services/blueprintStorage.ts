import { Blueprint } from "../types";

const STORAGE_KEY = 'lae_blueprints_v1';

export const blueprintStorage = {
  getAll: (): Blueprint[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Sort by newest first
      return parsed.sort((a: Blueprint, b: Blueprint) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error("Failed to load blueprints from storage", e);
      return [];
    }
  },

  save: (blueprint: Blueprint): void => {
    try {
      const current = blueprintStorage.getAll();
      // Limit to 10 items to prevent QuotaExceededError with base64 images
      const updated = [blueprint, ...current].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        throw new Error("Storage full. Please delete some saved blueprints.");
      }
      throw e;
    }
  },

  delete: (id: string): Blueprint[] => {
    try {
      const current = blueprintStorage.getAll();
      const updated = current.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Failed to delete blueprint", e);
      return [];
    }
  }
};
