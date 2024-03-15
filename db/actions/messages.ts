"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { findOrCreateChat } from "./chats";
import { db } from "../db";
import { MessageSelect, messages } from "../schemas/messages";
import { and, eq } from "drizzle-orm";

export async function getMessagesByChatId(chatId: string) {
  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    with: { author: true },
  });
}

export async function markMessageDeleted(
  messageId: string,
): Promise<DBActionResult<MessageSelect>> {
  const { user } = await getAuth();
  if (!user) return { status: "error", error: "Unauthorized access." };

  const data = await db
    .update(messages)
    .set({ deleted: true })
    .where(and(eq(messages.authorId, user.id), eq(messages.id, messageId)))
    .returning()
    .get();

  return { status: "ok", data };
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
