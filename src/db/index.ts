import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/** Fichier SQLite local. Modifiable via la variable DATABASE_URL. */
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:./data/app.db";

const client = createClient({ url: DATABASE_URL });

export const db = drizzle(client, { schema });
export { schema };
