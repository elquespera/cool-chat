import { PropsWithChildren } from "react";
import { ChatProvider } from "./chat/chat-provider";
import { SocketProvider } from "./socket/socket-provider";
import { getAuth } from "@/lib/auth/get-auth";
import { AuthProvider } from "./auth/auth-provider";
import { MessageProvider } from "./message/message-provider";
import { ContactProvider } from "./contacts/contact-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import {
  InitialSettings,
  SettingsProvider,
} from "./settings/settings-provider";
import { AssistantProvider } from "./assistant/assistant-provider";
import { getAssistantUser } from "@/db/actions/users";
import { getSettings } from "@/db/actions/settings";
import { defaultColor } from "@/constants";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();

  const assistant = await getAssistantUser();
  let settings: InitialSettings = { color: defaultColor };

  if (user) {
    const settingsResult = await getSettings(user.id);
    if (settingsResult.ok && settingsResult.data) {
      settings = settingsResult.data;
    }
  }

  return (
    <AuthProvider user={user}>
      <SettingsProvider initialSettings={settings}>
        <ChatWindowProvider>
          <SocketProvider>
            <ChatProvider>
              <MessageProvider>
                <AssistantProvider assistant={assistant}>
                  <ContactProvider>{children}</ContactProvider>
                </AssistantProvider>
              </MessageProvider>
            </ChatProvider>
          </SocketProvider>
        </ChatWindowProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
