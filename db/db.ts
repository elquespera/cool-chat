import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { dbConfig } from "./db-config";
import { schema } from "./schema";

const client = createClient(dbConfig);
export const db = drizzle(client, { schema });
