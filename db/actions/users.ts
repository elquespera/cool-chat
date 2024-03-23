"use server";

import { assistantId } from "@/constants";
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
import { countUnreadMesages, getLastMessage } from "./messages";

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
  if (!user) return { ok: false, error: "Unauthorized access." };

  const data = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!data) return { ok: false, error: "User not found" };
  return { ok: true, data };
}

export async function getAssistantUser() {
  const result = await getUserById(assistantId);
  return result.ok ? result.data : null;
}

export async function searchUsers(
  searchValue: string,
): Promise<DBActionResult<ContactUser[]>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };
  if (!searchValue.length) return { ok: true, data: [] };

  const search = `${searchValue}%`;

  try {
    const data = await db.query.users.findMany({
      where: and(
        or(like(users.email, search), like(users.username, search)),
        ne(users.id, user.id),
      ),
      columns: { hashedPassword: false, providerId: false },
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unknown error" };
  }
}

export async function getUserContacts(): Promise<
  DBActionResult<ContactUserWithChat[]>
> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  try {
    const chats = await getUserChats(user.id);
    const data = await Promise.all(
      chats.map(async (chat) => {
        const { userOne, userTwo } = chat;
        const author = userOne.id === user.id ? userTwo : userOne;
        const unreadMessages = await countUnreadMesages(chat.id);
        const lastMessage = await getLastMessage(chat.id);

        return {
          ...author,
          chatId: chat.id,
          unreadCount: unreadMessages,
          lastMessage: lastMessage.ok ? lastMessage.data?.content : undefined,
          lastTimestamp: lastMessage.ok
            ? lastMessage.data?.createdAt
            : undefined,
        };
      }),
    );

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unknown error" };
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
