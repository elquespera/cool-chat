import { drizzle } from "drizzle-orm/better-sqlite3";
import { dbConfig } from "./db-config";
import { schema } from "./schema";
import Database from "better-sqlite3";

const client = new Database(dbConfig.url, { timeout: 1000 });

export const db = drizzle(client, { schema });
