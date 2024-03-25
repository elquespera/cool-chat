"use server";

import { and, count, desc, eq, isNull, ne, or } from "drizzle-orm";
import { db } from "../db";
import { MessageInsert, MessageSelect, messages } from "../schemas/messages";
import { findOrCreateChat } from "./chats";
import { withAuth } from "./with-auth";

// not protected
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

export const getLastMessage = async (chatId: string) =>
  withAuth<MessageSelect>(async () => {
    const result = await db.query.messages.findMany({
      where: eq(messages.chatId, chatId),
      limit: 1,
      orderBy: desc(messages.createdAt),
    });

    return result[0];
  });

export const createMessage = async (data: MessageInsert) =>
  withAuth<MessageSelect>(async () =>
    db.insert(messages).values(data).returning().get(),
  );

export const updateMessage = async (
  messageId: string,
  data: Partial<MessageInsert>,
) =>
  withAuth<MessageSelect>(async () =>
    db
      .update(messages)
      .set(data)
      .where(eq(messages.id, messageId))
      .returning()
      .get(),
  );

export const deleteMessage = async (messageId: string) =>
  withAuth<MessageSelect>(async () =>
    db.delete(messages).where(eq(messages.id, messageId)).returning().get(),
  );

export const markMessagesDelivered = async (chatId: string) =>
  withAuth<MessageSelect>(async (user) => {
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

    return result[result.length - 1];
  });

export const countUnreadMesages = async (chatId: string) =>
  withAuth<number>(async (user) => {
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
  });

export const sendMessage = async (contactId: string, message: string) =>
  withAuth<MessageSelect>(async (user) => {
    const chat = await findOrCreateChat(user.id, contactId);

    if (!chat.ok) return;

    return await db
      .insert(messages)
      .values({ authorId: user.id, chatId: chat.data.id, content: message })
      .returning()
      .get();
  });
