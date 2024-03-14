import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  providerId: text("provider_id"),

  email: text("email").unique(),
  hashedPassword: text("hashed_password"),
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
  })
);

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  expiresAt: integer("expires_at").notNull(),
});

export type UserInsert = typeof users.$inferInsert;
export type DatabaseUser = typeof users.$inferSelect;
export type ContactUser = Omit<DatabaseUser, "hashedPassword" | "providerId">;
export type AccountInsert = typeof accounts.$inferInsert;
