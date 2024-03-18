import { PropsWithChildren } from "react";
import { ChatProvider } from "./chat/chat-provider";
import { SocketProvider } from "./socket/socket-provider";
import { getAuth } from "@/lib/auth/get-auth";
import { AuthProvider } from "./auth/auth-provider";
import { MessageProvider } from "./message/message-provider";
import { ContactProvider } from "./contacts/contact-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import { ColorProvider } from "./color/color-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();

  return (
    <AuthProvider user={user}>
      <ColorProvider>
        <ChatWindowProvider>
          <SocketProvider>
            <ChatProvider>
              <MessageProvider>
                <ContactProvider>{children}</ContactProvider>
              </MessageProvider>
            </ChatProvider>
          </SocketProvider>
        </ChatWindowProvider>
      </ColorProvider>
    </AuthProvider>
  );
}
