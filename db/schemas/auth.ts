import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const UserRoles = ["user", "assistant", "admin"] as const;
export type UserRole = (typeof UserRoles)[number];

export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  role: text("role", { enum: UserRoles }).default("user").notNull(),

  username: text("username"),
  avatarUrl: text("avatar_url"),
  providerId: text("provider_id"),

  email: text("email").unique(),
  hashedPassword: text("hashed_password"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
);

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  expiresAt: integer("expires_at").notNull(),
});

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type ContactUser = Omit<UserSelect, "hashedPassword" | "providerId">;

export type ContactUserWithChat = ContactUser & {
  chatId?: string;
  unreadCount?: number;
  lastMessage?: string;
  lastTimestamp?: Date;
};

export type AccountInsert = typeof accounts.$inferInsert;
