"use server";

import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { chats } from "../schemas/chats";

export async function findChatByIds(userOneId: string, userTwoId: string) {
  return db.query.chats.findFirst({
    where: or(
      and(eq(chats.userOneId, userOneId), eq(chats.userTwoId, userTwoId)),
      and(eq(chats.userOneId, userTwoId), eq(chats.userTwoId, userOneId)),
    ),
  });
}

export async function findOrCreateChat(userOneId: string, userTwoId: string) {
  const result = await findChatByIds(userOneId, userTwoId);
  if (result) return result;
  return db.insert(chats).values({ userOneId, userTwoId }).returning().get();
}