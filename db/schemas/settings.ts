import { randomUUID } from "crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { defaultColor, themeColors } from "@/constants";

export const settings = sqliteTable("settings", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  color: text("color", { enum: themeColors }).default(defaultColor).notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export type SettingsSelect = typeof settings.$inferSelect;
export type SettingsInsert = typeof settings.$inferInsert;
