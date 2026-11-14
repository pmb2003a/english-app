/** Crée ou met à jour les tables de la base locale (data/app.db). */
import { mkdirSync } from "node:fs";
import { migrate } from "drizzle-orm/libsql/migrator";

mkdirSync("data", { recursive: true });

async function main() {
  const { db } = await import("../src/db");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✔ Base de données à jour.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
