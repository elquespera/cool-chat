"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { findOrCreateChat } from "./chats";
import { db } from "../db";
import {
  MessageInsert,
  MessageSelect,
  MessageState,
  messages,
} from "../schemas/messages";
import { and, eq } from "drizzle-orm";

export async function getMessagesByChatId(chatId: string) {
  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    with: { author: true },
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
    .where(and(eq(messages.authorId, user.id), eq(messages.id, messageId)))
    .returning()
    .get();

  return { status: "ok", data: result };
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
