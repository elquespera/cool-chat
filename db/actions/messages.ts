"use server";

import { and, count, desc, eq, isNull, ne, or } from "drizzle-orm";
import { db } from "../db";
import {
  MessageInsert,
  MessageSelect,
  MessageWithAuthor,
  messages,
} from "../schemas/messages";
import { findOrCreateChat } from "./chats";
import { withAuth } from "./with-auth";
import { decryptText, encryptText } from "@/lib/encrypt-text";

export const getMessagesByChatId = async (
  chatId: string,
  pageIndex = 0,
  messagesPerPage = 10,
) =>
  withAuth<MessageWithAuthor[]>(async () => {
    const result = await db.query.messages.findMany({
      where: eq(messages.chatId, chatId),
      with: { author: true },
      offset: pageIndex * messagesPerPage,
      limit: messagesPerPage,
      orderBy: desc(messages.createdAt),
    });

    return result.map(decryptMessage);
  });

export const getLastMessage = async (chatId: string) =>
  withAuth<MessageSelect>(async () => {
    const result = await db.query.messages.findFirst({
      where: eq(messages.chatId, chatId),
      orderBy: desc(messages.createdAt),
    });
    return result ? decryptMessage(result) : undefined;
  });

export const createMessage = async ({ content, ...data }: MessageInsert) =>
  withAuth<MessageSelect>(async () =>
    db
      .insert(messages)
      .values({ ...data, content: encryptText(content) })
      .returning()
      .get(),
  );

export const updateMessage = async (
  messageId: string,
  { content, ...data }: Partial<MessageInsert>,
) =>
  withAuth<MessageSelect>(async () =>
    db
      .update(messages)
      .set({ ...data, content: content ? encryptText(content) : undefined })
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
      .values({
        authorId: user.id,
        chatId: chat.data.id,
        content: encryptText(message),
      })
      .returning()
      .get();
  });

const decryptMessage = <T extends MessageSelect>({
  content,
  ...restMessage
}: T) => ({ ...restMessage, content: decryptText(content) });
