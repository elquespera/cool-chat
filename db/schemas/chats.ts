import { randomId } from "@/lib/random-id";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ContactUser, users } from "./auth";
import { messages } from "./messages";

export const chats = sqliteTable("chat", {
  id: text("id", { length: 36 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomId()),

  userOneId: text("user_one_id")
    .notNull()
    .references(() => users.id),

  userTwoId: text("user_two_id")
    .notNull()
    .references(() => users.id),

  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const chatsRelations = relations(chats, ({ many, one }) => ({
  messages: many(messages),
  userOne: one(users, {
    fields: [chats.userOneId],
    references: [users.id],
    relationName: "user_one",
  }),
  userTwo: one(users, {
    fields: [chats.userTwoId],
    references: [users.id],
    relationName: "user_two",
  }),
}));

export type ChatSelect = typeof chats.$inferSelect;
export type ChatInsert = typeof chats.$inferInsert;

export type OpenChat = ChatSelect & {
  interlocutor: ContactUser;
  status: UserStatus | null;
  unreadCount: number;
  lastMessage?: string;
  lastTimestamp?: Date;
  lastAuthor?: string;
};
