import { defaultSettings } from "@/constants";
import { getAssistantUsers } from "@/db/actions/assistant";
import { getSettings } from "@/db/actions/settings";
import { getAuth } from "@/lib/auth/get-auth";
import { PropsWithChildren } from "react";
import { AssistantProvider } from "./assistant/assistant-provider";
import { AuthProvider } from "./auth/auth-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import { ChatProvider } from "./chat/chat-provider";
import { MessageProvider } from "./message/message-provider";
import {
  InitialSettings,
  SettingsProvider,
} from "./settings/settings-provider";
import { SocketProvider } from "./socket/socket-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();
  const assistantsResponse = await getAssistantUsers();
  const assistants = assistantsResponse.ok ? assistantsResponse.data : null;

  let settings: InitialSettings = defaultSettings;

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
            <ChatProvider>
              <AssistantProvider assistants={assistants}>
                <MessageProvider>{children}</MessageProvider>
              </AssistantProvider>
            </ChatProvider>
          </SocketProvider>
        </ChatWindowProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
