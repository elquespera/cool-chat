import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { dbConfig } from "./db-config";
import { schema } from "./schema";

const client = createClient({ ...dbConfig, syncInterval: 1000 });

export const db = drizzle(client, { schema });
