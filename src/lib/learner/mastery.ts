/**
 * Règle de mise à jour de la maîtrise d'un concept.
 *
 * Volontairement simple pour démarrer : une moyenne mobile qui pèse fort les
 * premières réponses, puis se stabilise (taux minimum 0,2). On pourra la
 * remplacer plus tard (modèle bayésien, oubli dans le temps...) sans toucher
 * au reste de l'app, puisque tout passe par cette fonction.
 */
export function nextMasteryScore(
  previousScore: number,
  attemptsCount: number,
  attemptScore: number,
): number {
  const rate = Math.max(0.2, 1 / (attemptsCount + 1));
  const next = previousScore + (attemptScore - previousScore) * rate;
  return Math.min(1, Math.max(0, next));
}
