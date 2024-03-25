"use server";

import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { ChatInsert, ChatSelect, OpenChat, chats } from "../schemas/chats";
import { withAuth } from "./with-auth";
import { countUnreadMesages, getLastMessage } from "./messages";
import { getSettings } from "./settings";

//to be removed
export async function getUserChats(userId: string) {
  return db.query.chats.findMany({
    where: or(eq(chats.userOneId, userId), eq(chats.userTwoId, userId)),
    with: { userOne: true, userTwo: true },
  });
}

export const getChatById = async (chatId: string) =>
  withAuth<ChatSelect>(async () =>
    db.query.chats.findFirst({ where: eq(chats.id, chatId) }),
  );

export const findChatByIds = async (userOneId: string, userTwoId: string) =>
  withAuth<ChatSelect>(async () =>
    db.query.chats.findFirst({
      where: or(
        and(eq(chats.userOneId, userOneId), eq(chats.userTwoId, userTwoId)),
        and(eq(chats.userOneId, userTwoId), eq(chats.userTwoId, userOneId)),
      ),
    }),
  );

export const findOrCreateChat = async (userOneId: string, userTwoId: string) =>
  withAuth<ChatSelect>(async () => {
    const result = await findChatByIds(userOneId, userTwoId);
    if (result.ok) return result.data;
    return db.insert(chats).values({ userOneId, userTwoId }).returning().get();
  });

export async function addChat(data: ChatInsert) {
  return db.insert(chats).values(data).returning().get();
}

export async function deleteChat(chatId: string) {
  return db.delete(chats).where(eq(chats.id, chatId)).returning().get();
}

export const getOpenChats = async () =>
  withAuth<OpenChat[]>(async (user) => {
    const openChats = await db.query.chats.findMany({
      where: or(eq(chats.userOneId, user.id), eq(chats.userTwoId, user.id)),
      with: { userOne: true, userTwo: true },
    });

    const data: OpenChat[] = await Promise.all(
      openChats.map(async (chat) => {
        const { userOne, userTwo } = chat;
        const interlocutor = userOne.id === user.id ? userTwo : userOne;

        const [unreadCount, lastMessage, settings] = await Promise.all([
          countUnreadMesages(chat.id),
          getLastMessage(chat.id),
          getSettings(interlocutor.id),
        ]);

        const lastData = lastMessage.ok ? lastMessage.data : null;

        return {
          ...chat,
          interlocutor,
          status: settings.ok ? settings.data.status : null,
          unreadCount: unreadCount.ok ? unreadCount.data : 0,
          lastMessage: lastData?.content,
          lastTimestamp: lastData?.createdAt,
          lastAuthor: lastData?.authorId,
        };
      }),
    );

    data.sort((a, b) =>
      a.lastTimestamp && b.lastTimestamp
        ? b.lastTimestamp.getTime() - a.lastTimestamp.getTime()
        : 0,
    );

    return data;
  });
