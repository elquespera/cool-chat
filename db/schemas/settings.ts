import { defaultColor, defaultSound, themeColors } from "@/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const settings = sqliteTable("settings", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  color: text("color", { enum: themeColors }).default(defaultColor).notNull(),
  sound: integer("sound", { mode: "boolean" }).default(defaultSound).notNull(),

  status: text("status", { enum: ["offline", "online"] })
    .default("offline")
    .notNull(),
});

export type SettingsSelect = typeof settings.$inferSelect;
export type SettingsInsert = typeof settings.$inferInsert;
