import type { AIProvider, AIProviderId } from "../types";

/** Emplacement pour un fournisseur pas encore branché (Ollama, Gemini, Groq). */
export function notConfigured(id: AIProviderId, label: string): AIProvider {
  return {
    id,
    label,
    isAvailable: async () => false,
    complete: async () => {
      throw new Error(`Le fournisseur « ${label} » n'est pas encore implémenté.`);
    },
  };
}
