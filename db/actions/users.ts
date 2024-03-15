"use server";

import { and, eq, like, ne, or } from "drizzle-orm";
import { db } from "../db";
import { ContactUser, UserInsert, users } from "../schemas/auth";
import { getAuth } from "@/lib/auth/get-auth";
import { findChatByIds, getUserChats } from "./chats";

export async function getUserByEmailOrUsername(emailOrUsername: string) {
  return db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername),
    ),
  });
}

export async function searchUsers(
  searchValue: string,
): Promise<DBActionResult<ContactUser[]>> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };
  if (!searchValue.length) return { status: "ok", data: [] };

  const search = `${searchValue}%`;

  try {
    const data = await db.query.users.findMany({
      where: and(
        or(like(users.email, search), like(users.username, search)),
        ne(users.id, user.id),
      ),
      columns: { hashedPassword: false, providerId: false },
    });

    return { status: "ok", data };
  } catch (error) {
    return { status: "error", error: "Unknown error" };
  }
}

export async function getUserContacts(): Promise<
  DBActionResult<ContactUser[]>
> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };
  try {
    const chats = await getUserChats(user.id);
    const data: ContactUser[] = chats.map(({ userOne, userTwo }) =>
      userOne.id === user.id ? userTwo : userOne,
    );

    return { status: "ok", data };
  } catch (error) {
    return { status: "error", error: "Unknown error" };
  }
}

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
