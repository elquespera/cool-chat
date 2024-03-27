"use client";
import { AssistantType, assistantInfo } from "@/constants/assistants";
import { useState } from "react";
import { IconButton } from "../common/icon-button";
import { ChatConversationIcon } from "../icons/chat-conversation-icon";
import { UserAvatar } from "../user/user-avatar";
import { AssistantPicker } from "./assistant-picker";
import { addChat, findOrCreateChat } from "@/db/actions/chats";
import { useAuth } from "../providers/auth/auth-context";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { useChat } from "../providers/chat/chat-context";

export function AssistantWelcome() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetchOpenChats } = useChat();
  const [assistantType, setAssistantType] = useState<AssistantType>("qwen");
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
    <div className="flex grow flex-col items-center justify-center gap-12 p-4">
      <h2 className="text-center text-3xl font-semibold uppercase tracking-tighter">
        Choose a Model
      </h2>
      <AssistantPicker
        assistant={assistantType}
        onAssistantChange={handleAssistantChange}
      />
      <div className="flex max-w-md gap-4 rounded-lg border bg-card px-6 py-4 shadow-md">
        <UserAvatar className="h-20 w-20" avatarUrl={assistant.avatarUrl} />
        <div className="flex min-h-48 flex-col">
          <h3 className="text-xl font-semibold">{assistant.username}</h3>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {assistant.description}
          </p>
          <div className="ml-auto mt-auto flex items-end gap-2">
            <IconButton variant="link" href={assistant.url}>
              Reference
            </IconButton>
            <IconButton
              icon={<ChatConversationIcon />}
              onClick={handleChatClick}
            >
              Chat
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
