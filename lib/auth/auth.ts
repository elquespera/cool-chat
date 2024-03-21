import { db } from "@/db/db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { UserSelect, sessions, users } from "@/db/schemas/auth";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes: ({ email, username, avatarUrl, role, providerId }) => {
    return {
      email,
      username,
      avatarUrl,
      role,
      providerId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<UserSelect, "id">;
  }
}
