/**
 * Schéma de la base de données — le « modèle d'apprenant ».
 *
 * Idée centrale : chaque réponse est enregistrée (table `attempts`) avec la
 * compétence et le concept travaillés. Chaque concept a un score de maîtrise
 * (table `mastery`) mis à jour après chaque tentative. Plus tard, le moteur
 * adaptatif lira `mastery` pour composer la séance du jour.
 */
import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

/** Les grandes compétences : grammar, vocabulary, listening, speaking, writing. */
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(), // ex. "grammar"
  name: text("name").notNull(), // ex. "Grammaire"
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Un concept = une unité qu'on peut maîtriser ou non.
 * Ex. : "present-perfect-vs-preterit", "phrasal-verbs-business",
 * "connected-speech-weak-forms", "credit-spread-vocabulary".
 */
export const concepts = sqliteTable(
  "concepts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    /** Niveau CECRL visé : A2, B1, B2, C1, C2. */
    cefrLevel: text("cefr_level", {
      enum: ["A2", "B1", "B2", "C1", "C2"],
    }).notNull(),
    /** "general" ou "finance" : permet au module Business/Finance de filtrer. */
    domain: text("domain", { enum: ["general", "finance"] })
      .notNull()
      .default("general"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("concepts_slug_unique").on(t.slug)],
);

/** Une séance d'étude (utile au moteur adaptatif pour planifier ~45–60 min). */
export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** "daily" (séance proposée), "diagnostic", "free" (pratique libre). */
  kind: text("kind", { enum: ["daily", "diagnostic", "free"] }).notNull(),
  plannedMinutes: integer("planned_minutes"),
  startedAt: integer("started_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  endedAt: integer("ended_at", { mode: "timestamp" }),
});

/** Cartes de vocabulaire avec planification de révision espacée (SRS). */
export const vocabCards = sqliteTable(
  "vocab_cards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    term: text("term").notNull(),
    definition: text("definition").notNull(),
    example: text("example"),
    translationFr: text("translation_fr"),
    domain: text("domain", { enum: ["general", "finance"] })
      .notNull()
      .default("general"),
    /** Concept de rattachement facultatif (ex. une famille de mots). */
    conceptId: integer("concept_id").references(() => concepts.id),
    /** D'où vient la carte : "manual", "listening", "writing"... */
    source: text("source"),
    // --- État SRS (type SM-2 ; on pourra passer à FSRS plus tard) ---
    easeFactor: real("ease_factor").notNull().default(2.5),
    intervalDays: real("interval_days").notNull().default(0),
    repetitions: integer("repetitions").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    dueAt: integer("due_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    createdAt: createdAt(),
  },
  (t) => [index("vocab_cards_due_idx").on(t.dueAt)],
);

/**
 * Le journal de toutes les réponses. C'est la source de vérité : la maîtrise
 * peut toujours être recalculée à partir d'ici.
 */
export const attempts = sqliteTable(
  "attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id),
    conceptId: integer("concept_id").references(() => concepts.id),
    vocabCardId: integer("vocab_card_id").references(() => vocabCards.id),
    sessionId: integer("session_id").references(() => studySessions.id),
    /** Type d'exercice : "mcq", "gap_fill", "srs_review", "dictation"... */
    exerciseType: text("exercise_type").notNull(),
    prompt: text("prompt"),
    userAnswer: text("user_answer"),
    expectedAnswer: text("expected_answer"),
    isCorrect: integer("is_correct", { mode: "boolean" }),
    /** Score normalisé entre 0 et 1 (permet les réponses partiellement justes). */
    score: real("score").notNull(),
    /** Étiquette d'erreur pour la révision ciblée (ex. "tense", "article"). */
    errorTag: text("error_tag"),
    responseTimeMs: integer("response_time_ms"),
    createdAt: createdAt(),
  },
  (t) => [
    index("attempts_concept_idx").on(t.conceptId),
    index("attempts_created_idx").on(t.createdAt),
  ],
);

/** Score de maîtrise courant par concept (0 = inconnu, 1 = maîtrisé). */
export const mastery = sqliteTable("mastery", {
  conceptId: integer("concept_id")
    .primaryKey()
    .references(() => concepts.id),
  score: real("score").notNull().default(0),
  attemptsCount: integer("attempts_count").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  lastPracticedAt: integer("last_practiced_at", { mode: "timestamp" }),
  /** Date à laquelle le concept devrait être revu. */
  nextReviewAt: integer("next_review_at", { mode: "timestamp" }),
});

export type Skill = typeof skills.$inferSelect;
export type Concept = typeof concepts.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type Mastery = typeof mastery.$inferSelect;
export type VocabCard = typeof vocabCards.$inferSelect;
