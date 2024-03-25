"use server";

import { assistantId } from "@/constants";
import { and, eq, like, ne, or } from "drizzle-orm";
import { db } from "../db";
import { ContactUser, UserInsert, users } from "../schemas/auth";
import { withAuth } from "./with-auth";

// To be removed
export async function getUserByEmailOrUsername(emailOrUsername: string) {
  return db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername),
    ),
  });
}

export const getUserById = async (id: string) =>
  withAuth<ContactUser>(
    async () =>
      await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: { hashedPassword: false, providerId: false },
      }),
  );

export const searchUsers = async (searchValue: string) =>
  withAuth<ContactUser[]>(async (user) => {
    if (!searchValue.length) return [];
    const search = `${searchValue}%`;

    return db.query.users.findMany({
      where: and(
        or(like(users.email, search), like(users.username, search)),
        ne(users.id, user.id),
      ),
      columns: { hashedPassword: false, providerId: false },
    });
  });

export async function addUser(data: UserInsert) {
  return db.insert(users).values(data).returning().get();
}

export async function updateUser(userId: string, data: UserInsert) {
  return db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning()
    .get();
}

export async function getAssistantUser() {
  const result = await getUserById(assistantId);
  return result.ok ? result.data : null;
}
