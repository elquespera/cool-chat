import { PropsWithChildren } from "react";
import { ChatProvider } from "./chat/chat-provider";
import { SocketProvider } from "./socket/socket-provider";
import { getAuth } from "@/lib/auth/get-auth";
import { AuthProvider } from "./auth/auth-provider";
import { MessageProvider } from "./message/message-provider";
import { ContactProvider } from "./contacts/contact-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import { ColorProvider } from "./color/color-provider";
import { AssistantProvider } from "./assistant/assistant-provider";
import { getAssistantUser } from "@/db/actions/users";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();
  const assistant = await getAssistantUser();

  return (
    <AuthProvider user={user}>
      <ColorProvider>
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
      </ColorProvider>
    </AuthProvider>
  );
}
