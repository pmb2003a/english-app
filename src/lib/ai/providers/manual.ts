import type { AIProvider, AIRequest } from "../types";

/** Transforme la requête en un texte unique à copier-coller dans un chat IA. */
export function buildManualPrompt({ messages, json }: AIRequest): string {
  const parts = messages.map((m) =>
    m.role === "user" ? m.content : `[${m.role.toUpperCase()}]\n${m.content}`,
  );
  if (json) parts.push("Réponds uniquement avec du JSON valide, sans texte autour.");
  return parts.join("\n\n");
}

export const manualProvider: AIProvider = {
  id: "manual",
  label: "Copier-coller (chat Claude)",
  isAvailable: async () => true,
  complete: async (request) => ({ kind: "manual", prompt: buildManualPrompt(request) }),
};
