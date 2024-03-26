import { defaultBackground, defaultColor, defaultSound } from "@/constants";
import { getSettings } from "@/db/actions/settings";
import { getAuth } from "@/lib/auth/get-auth";
import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth/auth-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import {
  InitialSettings,
  SettingsProvider,
} from "./settings/settings-provider";
import { SocketProvider } from "./socket/socket-provider";
import { getAssistantUser } from "@/db/actions/users";
import { ChatProvider } from "./chat/chat-provider";
import { AssistantProvider } from "./assistant/assistant-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();
  const assistantResponse = await getAssistantUser();
  const assistant = assistantResponse.ok ? assistantResponse.data : null;

  let settings: InitialSettings = {
    color: defaultColor,
    sound: defaultSound,
    background: defaultBackground,
  };

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
              <AssistantProvider assistant={assistant}>
                {children}
              </AssistantProvider>
            </ChatProvider>
          </SocketProvider>
        </ChatWindowProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
