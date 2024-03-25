import { defaultColor } from "@/constants";
import { getSettings } from "@/db/actions/settings";
import { getAssistantUser } from "@/db/actions/users";
import { getAuth } from "@/lib/auth/get-auth";
import { PropsWithChildren } from "react";
import { AssistantProvider } from "./assistant/assistant-provider";
import { AuthProvider } from "./auth/auth-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import { OpenChatsProvider } from "./open-chats/open-chats-provider";
import {
  InitialSettings,
  SettingsProvider,
} from "./settings/settings-provider";
import { SocketProvider } from "./socket/socket-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();

  const assistant = await getAssistantUser();
  let settings: InitialSettings = { color: defaultColor };

  if (user) {
    const settingsResult = await getSettings(user.id);
    if (settingsResult.ok) {
      settings = settingsResult.data;
    }
  }

  return (
    <AuthProvider user={user}>
      <SettingsProvider initialSettings={settings}>
        <ChatWindowProvider>
          <SocketProvider>
            <OpenChatsProvider>
              <AssistantProvider assistant={assistant}>
                {children}
              </AssistantProvider>
            </OpenChatsProvider>
          </SocketProvider>
        </ChatWindowProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
