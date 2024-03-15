import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { chats } from "./chats";

export const messages = sqliteTable("message", {
  id: text("id", { length: 36 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  content: text("content").notNull(),

  authorId: text("author_id")
    .notNull()
    .references(() => users.id),

  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),

  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  author: one(users, {
    fields: [messages.authorId],
    references: [users.id],
  }),

  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export type MessageInsert = typeof messages.$inferInsert;
export type MessageSelect = typeof messages.$inferSelect;
