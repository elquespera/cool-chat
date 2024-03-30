"use client";
import {
  AssistantType,
  assistantInfo,
  defaultAssistantType,
} from "@/constants/assistants";
import { routes } from "@/constants/routes";
import { addChat } from "@/db/actions/chats";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton } from "../common/icon-button";
import { ChatConversationIcon } from "../icons/chat-conversation-icon";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { UserAvatar } from "../user/user-avatar";
import { AssistantPicker } from "./assistant-picker";

export function AssistantWelcome() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetchOpenChats } = useChat();
  const [assistantType, setAssistantType] =
    useState<AssistantType>(defaultAssistantType);
  const assistant = assistantInfo[assistantType];

  const handleAssistantChange = (value: AssistantType) => {
    if (!value) return;
    setAssistantType(value);
  };

  const handleChatClick = async () => {
    if (!user) return;

    const result = await addChat({
      userOneId: user.id,
      userTwoId: assistantType,
    });

    if (result.ok) {
      refetchOpenChats();
      router.push(`${routes.chat}/${result.data.id}`);
    }
  };

  return (
    <div className="flex grow flex-col items-center justify-center p-4 @container">
      <h2 className="mb-2 select-none text-center text-3xl font-semibold uppercase tracking-tighter @lg:text-4xl">
        Choose a Model
      </h2>
      <p className="mb-8 select-none font-semibold text-muted-foreground">
        Chat with an AI Assistant
      </p>
      <div className="flex max-w-lg flex-col gap-8 rounded-lg border bg-card p-6 shadow-md @lg:p-8">
        <AssistantPicker
          assistant={assistantType}
          onAssistantChange={handleAssistantChange}
        />
        <div className="flex flex-col items-center gap-4">
          <UserAvatar className="h-32 w-32" avatarUrl={assistant.avatarUrl} />
          <h3 className="text-xl font-semibold">{assistant.username}</h3>
          <p className="mb-6 mt-2 min-h-20 text-sm font-medium text-muted-foreground">
            {assistant.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap justify-between gap-2">
          <IconButton variant="link" href={assistant.url}>
            Reference
          </IconButton>
          <IconButton icon={<ChatConversationIcon />} onClick={handleChatClick}>
            Start a Chat
          </IconButton>
        </div>
      </div>
    </div>
  );
}
