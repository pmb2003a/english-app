/** Remplit la base avec les données de départ (les compétences). Relançable sans risque. */
import { db, schema } from "../src/db";

const SKILLS = [
  { id: "grammar", name: "Grammaire", sortOrder: 1 },
  { id: "vocabulary", name: "Vocabulaire", sortOrder: 2 },
  { id: "listening", name: "Compréhension orale", sortOrder: 3 },
  { id: "speaking", name: "Expression orale", sortOrder: 4 },
  { id: "writing", name: "Expression écrite", sortOrder: 5 },
];

async function main() {
  for (const skill of SKILLS) {
    await db
      .insert(schema.skills)
      .values(skill)
      .onConflictDoUpdate({
        target: schema.skills.id,
        set: { name: skill.name, sortOrder: skill.sortOrder },
      });
  }
  console.log(`✔ ${SKILLS.length} compétences enregistrées.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
