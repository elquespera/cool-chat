import { defaultSettings } from "@/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { themeColors } from "@/constants/theme-color";
import { themeBackgrounds } from "@/constants/theme-background";

export const settings = sqliteTable("settings", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  color: text("color", { enum: themeColors })
    .default(defaultSettings.color)
    .notNull(),
  background: text("background", { enum: themeBackgrounds })
    .default(defaultSettings.background)
    .notNull(),
  sound: integer("sound", { mode: "boolean" })
    .default(defaultSettings.sound)
    .notNull(),
  resizeAttachments: integer("resize_attachments", { mode: "boolean" })
    .default(defaultSettings.resizeAttachments)
    .notNull(),
});

export type SettingsSelect = typeof settings.$inferSelect;
export type SettingsInsert = typeof settings.$inferInsert;
