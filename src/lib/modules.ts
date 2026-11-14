/** Liste des modules de l'app : sert à la navigation et aux pages d'attente. */
export interface AppModule {
  href: string;
  label: string;
  summary: string;
  planned: string[];
}

export const MODULES: AppModule[] = [
  {
    href: "/",
    label: "Tableau de bord",
    summary: "Votre séance du jour et l'état de vos compétences.",
    planned: [
      "Séance du jour composée par le moteur adaptatif (45–60 min)",
      "Maîtrise par compétence et par concept",
      "Cartes de vocabulaire à réviser aujourd'hui",
    ],
  },
  {
    href: "/grammar",
    label: "Grammaire",
    summary: "Diagnostic, parcours ciblé et révision de vos erreurs.",
    planned: [
      "Test de diagnostic pour situer chaque point de grammaire",
      "Parcours de concepts ordonné selon vos lacunes",
      "Révision des erreurs récurrentes",
    ],
  },
  {
    href: "/vocabulary",
    label: "Vocabulaire",
    summary: "Cartes de vocabulaire en révision espacée (SRS).",
    planned: [
      "Ajout de mots depuis l'écoute, l'écrit ou à la main",
      "Révision espacée avec notation de la difficulté",
      "Paquets général et finance",
    ],
  },
  {
    href: "/listening",
    label: "Écoute",
    summary: "Vidéos YouTube et podcasts avec quiz et transcriptions.",
    planned: [
      "Lecture d'une vidéo ou d'un podcast avec transcription",
      "Quiz de compréhension et dictées courtes",
      "Mots inconnus envoyés vers le vocabulaire",
    ],
  },
  {
    href: "/speaking",
    label: "Expression orale",
    summary: "Conversation vocale avec une IA et retour sur vos erreurs.",
    planned: [
      "Reconnaissance et synthèse vocale du navigateur (Web Speech API)",
      "Scénarios de conversation (entretien, réunion, small talk)",
      "Retour sur la grammaire et le vocabulaire utilisés",
    ],
  },
  {
    href: "/writing",
    label: "Expression écrite",
    summary: "Rédaction corrigée et expliquée.",
    planned: [
      "Sujets d'écriture adaptés à votre niveau",
      "Correction détaillée par l'IA (gratuite ou copier-coller)",
      "Erreurs enregistrées dans votre modèle d'apprenant",
    ],
  },
  {
    href: "/business",
    label: "Business & Finance",
    summary: "Anglais des marchés, du crédit et de la finance d'entreprise.",
    planned: [
      "Vocabulaire marchés, crédit, titrisation, corporate finance",
      "Écoute de contenus financiers (earnings calls, analyses)",
      "Écrits professionnels : e-mails, notes d'analyse",
    ],
  },
];

export function getModule(href: string): AppModule {
  const found = MODULES.find((m) => m.href === href);
  if (!found) throw new Error(`Module inconnu : ${href}`);
  return found;
}
