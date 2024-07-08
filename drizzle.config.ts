import type { Config } from "drizzle-kit";

import { dbConfig as dbCredentials } from "./db/db-config";

export default {
  schema: "./db/schemas",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials,
} satisfies Config;
