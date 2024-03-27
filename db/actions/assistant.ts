import { AssistantType, assistantInfo } from "@/constants/assistants";
import { db } from "../db";
import { ContactUser, contactUserColumns, users } from "../schemas/auth";
import { getUserById } from "./users";
import { withAuth } from "./with-auth";

export const getAssistantUsers = async () =>
  withAuth<Record<AssistantType, ContactUser>>(async () => {
    const assistants = await Promise.all(
      Object.values(assistantInfo).map(async ({ id, username, avatarUrl }) => {
        const result = await getUserById(id);
        if (result.ok) return result.data;
        const user: ContactUser = await db
          .insert(users)
          .values({ id, username, avatarUrl, role: "assistant" })
          .returning(contactUserColumns)
          .get();
        return user;
      }),
    );

    return {
      tinydolphin: assistants[0],
      tinyllama: assistants[1],
      qwen: assistants[2],
    };
  });
