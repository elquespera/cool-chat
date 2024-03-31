"use server";

import { createAttachment } from "@/lib/attachment";
import { encryptText } from "@/lib/encrypt-text";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { MessageWithChat, messages } from "../schemas/messages";
import { findOrCreateChat, getChatById } from "./chats";
import { withAuth } from "./with-auth";

export const sendMessage = async (
  message: string,
  contactId: string,
  chatId?: string,
  attachmentForm?: FormData,
  resize?: boolean,
) =>
  withAuth<MessageWithChat>(async (user) => {
    const chatResponse = chatId
      ? await getChatById(chatId)
      : await findOrCreateChat(user.id, contactId);

    if (!chatResponse.ok) return;

    const attachment = await createAttachment(
      attachmentForm?.get("attachment") as File,
      resize,
    );

    const messageResponse = await db
      .insert(messages)
      .values({
        authorId: user.id,
        chatId: chatResponse.data.id,
        content: encryptText(message),
        attachment,
      })
      .returning()
      .get();

    return db.query.messages.findFirst({
      where: eq(messages.id, messageResponse.id),
      with: { chat: true },
    });
  });
