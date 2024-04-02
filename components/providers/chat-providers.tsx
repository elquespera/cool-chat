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
import { getWebsocketTicket } from "@/lib/ws/get-ws-ticket";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();
  const assistantsResponse = await getAssistantUsers();
  const assistants = assistantsResponse.ok ? assistantsResponse.data : null;

  let settings: InitialSettings = defaultSettings;
  let ticket: string | null = null;

  if (user) {
    const settingsResponse = await getSettings(user.id);
    if (settingsResponse.ok) {
      settings = settingsResponse.data;
    }

    const ticketResponse = await getWebsocketTicket();
    if (ticketResponse.ok) ticket = ticketResponse.data;
  }

  return (
    <AuthProvider user={user}>
      <SettingsProvider initialSettings={settings}>
        <ChatWindowProvider>
          <SocketProvider user={user} ticket={ticket}>
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
