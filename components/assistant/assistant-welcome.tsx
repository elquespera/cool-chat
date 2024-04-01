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
import { ArrowUpIcon } from "../icons/arrow-up-icon";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
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
      <div className="group relative flex max-w-md flex-col gap-6 rounded-lg border bg-card p-8 transition-shadow hover:shadow-xl">
        <AssistantPicker
          className="relative z-10 self-center"
          assistant={assistantType}
          onAssistantChange={handleAssistantChange}
        />
        <div className="flex flex-col items-center gap-2">
          <img
            alt={assistant.username}
            src={assistant.avatarUrl}
            className="max-w-40 rounded-full transition-transform group-hover:scale-105"
          />
          <h3 className="text-2xl font-semibold tracking-tight">
            {assistant.username}
          </h3>
          <p className="mb-2 min-h-20 text-sm text-muted-foreground">
            {assistant.description}
          </p>
        </div>
        <IconButton
          variant="link"
          className="absolute bottom-8 left-8 z-10"
          href={assistant.url}
        >
          Reference
        </IconButton>
        <button
          onClick={handleChatClick}
          className="bottom-8 right-8 self-end px-2 py-3 before:absolute before:inset-0"
        >
          <ArrowUpIcon className="h-6 w-6 rotate-90 transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </button>
      </div>
    </div>
  );
}
