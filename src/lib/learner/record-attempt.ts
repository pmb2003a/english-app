import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { NewAttempt } from "@/db/schema";
import { nextMasteryScore } from "./mastery";

/**
 * Point d'entrée unique pour enregistrer une réponse de l'apprenant.
 * Tous les modules (grammaire, écoute, SRS...) passeront par ici :
 * 1. on journalise la tentative ;
 * 2. si elle porte sur un concept, on met à jour son score de maîtrise.
 */
export async function recordAttempt(attempt: NewAttempt) {
  return db.transaction(async (tx) => {
    const [saved] = await tx.insert(schema.attempts).values(attempt).returning();

    if (attempt.conceptId != null) {
      const [current] = await tx
        .select()
        .from(schema.mastery)
        .where(eq(schema.mastery.conceptId, attempt.conceptId));

      const score = nextMasteryScore(
        current?.score ?? 0,
        current?.attemptsCount ?? 0,
        attempt.score,
      );
      const correct = attempt.isCorrect ? 1 : 0;

      await tx
        .insert(schema.mastery)
        .values({
          conceptId: attempt.conceptId,
          score,
          attemptsCount: 1,
          correctCount: correct,
          lastPracticedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: schema.mastery.conceptId,
          set: {
            score,
            attemptsCount: sql`${schema.mastery.attemptsCount} + 1`,
            correctCount: sql`${schema.mastery.correctCount} + ${correct}`,
            lastPracticedAt: new Date(),
          },
        });
    }

    return saved;
  });
}
