import { manualProvider } from "./providers/manual";
import { notConfigured } from "./providers/not-configured";
import type { AIProvider, AIProviderId } from "./types";

export * from "./types";

const providers: Record<AIProviderId, AIProvider> = {
  manual: manualProvider,
  ollama: notConfigured("ollama", "Ollama (local)"),
  gemini: notConfigured("gemini", "Google Gemini (gratuit)"),
  groq: notConfigured("groq", "Groq (gratuit)"),
};

/** Fournisseur choisi via AI_PROVIDER dans .env.local ; "manual" par défaut. */
export function getAIProvider(): AIProvider {
  const id = (process.env.AI_PROVIDER ?? "manual") as AIProviderId;
  return providers[id] ?? manualProvider;
}
