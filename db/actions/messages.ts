"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { and, count, desc, eq, isNull, ne, or } from "drizzle-orm";
import { db } from "../db";
import { MessageInsert, MessageSelect, messages } from "../schemas/messages";
import { findOrCreateChat } from "./chats";
import { wait } from "@/lib/utils";

export async function getMessagesByChatId(
  chatId: string,
  pageIndex = 0,
  messagesPerPage = 10,
) {
  await wait(500);

  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    with: { author: true },
    offset: pageIndex * messagesPerPage,
    limit: messagesPerPage,
    orderBy: desc(messages.createdAt),
  });
}

export async function updateMessage(
  messageId: string,
  data: Partial<MessageInsert>,
): Promise<DBActionResult<MessageSelect>> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };

  const result = await db
    .update(messages)
    .set(data)
    .where(eq(messages.id, messageId))
    .returning()
    .get();

  return { status: "ok", data: result };
}

export async function checkMessagesDelivered(
  chatId: string,
): Promise<DBActionResult<MessageSelect | null>> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };

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
    status: "ok",
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
  if (!user) return { status: "error", error: "Unauthorized access." };

  const chat = await findOrCreateChat(user.id, contactId);

  if (!chat) return { status: "error", error: "Failed to create chat." };

  const data = await db
    .insert(messages)
    .values({ authorId: user.id, chatId: chat.id, content: message })
    .returning()
    .get();

  return { status: "ok", data };
}
