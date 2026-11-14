/**
 * Abstraction des fournisseurs d'IA.
 *
 * Contrainte du projet : aucune API payante. Les modules (correction d'écrit,
 * conversation...) ne parlent qu'à cette interface ; on branche derrière :
 * - "manual"  : copier-coller vers son propre chat Claude (toujours disponible) ;
 * - "ollama"  : modèle local sur l'ordinateur ;
 * - "gemini" / "groq" : paliers gratuits, avec une clé personnelle.
 */
export type AIProviderId = "manual" | "ollama" | "gemini" | "groq";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  /** Demander une réponse JSON quand l'exercice doit être analysé par l'app. */
  json?: boolean;
  temperature?: number;
}

export type AIResult =
  /** Réponse obtenue automatiquement. */
  | { kind: "text"; text: string }
  /**
   * Mode manuel : l'app affiche `prompt`, l'utilisateur le colle dans son chat
   * Claude, puis recolle la réponse, qui est transmise à `parseManualReply`.
   */
  | { kind: "manual"; prompt: string };

export interface AIProvider {
  id: AIProviderId;
  label: string;
  /** Vrai si le fournisseur est configuré et joignable. */
  isAvailable(): Promise<boolean>;
  complete(request: AIRequest): Promise<AIResult>;
}
