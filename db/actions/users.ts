"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { and, eq, like, ne, or } from "drizzle-orm";
import { db } from "../db";
import {
  ContactUser,
  ContactUserWithChat,
  UserInsert,
  users,
} from "../schemas/auth";
import { getUserChats } from "./chats";
import { countUnreadMesages } from "./messages";
import { assistantId } from "@/constants";

export async function getUserByEmailOrUsername(emailOrUsername: string) {
  return db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername),
    ),
  });
}

export async function getUserById(
  id: string,
): Promise<DBActionResult<ContactUser>> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };

  const data = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!data) return { status: "error", error: "User not found" };
  return { status: "ok", data };
}

export async function getAssistantUser() {
  const result = await getUserById(assistantId);
  return result.status === "ok" ? result.data : null;
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
  DBActionResult<ContactUserWithChat[]>
> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };

  try {
    const chats = await getUserChats(user.id);
    const data = await Promise.all(
      chats.map(async (chat) => {
        const { userOne, userTwo } = chat;
        const author = userOne.id === user.id ? userTwo : userOne;
        const unseenMessages = await countUnreadMesages(chat.id);
        return { ...author, chatId: chat.id, unseenMessages };
      }),
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
