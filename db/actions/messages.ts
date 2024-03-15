"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { findOrCreateChat } from "./chats";
import { db } from "../db";
import { MessageSelect, messages } from "../schemas/messages";

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
