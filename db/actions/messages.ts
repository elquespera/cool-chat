"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { and, count, desc, eq, isNull, ne, or } from "drizzle-orm";
import { db } from "../db";
import { MessageInsert, MessageSelect, messages } from "../schemas/messages";
import { findOrCreateChat } from "./chats";

export async function getMessagesByChatId(
  chatId: string,
  pageIndex = 0,
  messagesPerPage = 10,
) {
  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    with: { author: true },
    offset: pageIndex * messagesPerPage,
    limit: messagesPerPage,
    orderBy: desc(messages.createdAt),
  });
}

export async function getLastMessage(
  chatId: string,
): Promise<DBActionResult<MessageSelect | null>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    limit: 1,
    orderBy: desc(messages.createdAt),
  });

  return result[0]
    ? { ok: true, data: result[0] }
    : { ok: false, error: "Message not found." };
}

export async function createMessage(
  data: MessageInsert,
): Promise<DBActionResult<MessageSelect>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db.insert(messages).values(data).returning().get();

  return { ok: true, data: result };
}

export async function updateMessage(
  messageId: string,
  data: Partial<MessageInsert>,
): Promise<DBActionResult<MessageSelect>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db
    .update(messages)
    .set(data)
    .where(eq(messages.id, messageId))
    .returning()
    .get();

  return { ok: true, data: result };
}

export async function deleteMessage(
  messageId: string,
): Promise<DBActionResult<MessageSelect | undefined>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db
    .delete(messages)
    .where(eq(messages.id, messageId))
    .returning()
    .get();

  return { ok: true, data: result };
}

export async function markMessagesDelivered(
  chatId: string,
): Promise<DBActionResult<MessageSelect | null>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db
    .update(messages)
    .set({ status: "delivered" })
    .where(
      and(
        eq(messages.chatId, chatId),
        ne(messages.authorId, user.id),
        isNull(messages.status),
      ),
    )
    .returning();

  return {
    ok: true,
    data: result.length > 0 ? result[result.length - 1] : null,
  };
}

export async function countUnreadMesages(chatId: string): Promise<number> {
  const { user } = await getAuth();
  if (!user) return 0;

  const result = await db
    .select({ value: count() })
    .from(messages)
    .where(
      and(
        eq(messages.chatId, chatId),
        ne(messages.authorId, user.id),
        or(isNull(messages.status), eq(messages.status, "delivered")),
      ),
    )
    .get();

  return result?.value ?? 0;
}

export async function sendMessage(
  contactId: string,
  message: string,
): Promise<DBActionResult<MessageSelect>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const chat = await findOrCreateChat(user.id, contactId);

  if (!chat) return { ok: false, error: "Failed to create chat." };

  const data = await db
    .insert(messages)
    .values({ authorId: user.id, chatId: chat.id, content: message })
    .returning()
    .get();

  return { ok: true, data };
}
