import { PropsWithChildren } from "react";
import { ChatProvider } from "./chat/chat-provider";
import { SocketProvider } from "./socket/socket-provider";

export function ChatProviders({ children }: PropsWithChildren) {
  return (
    <SocketProvider>
      <ChatProvider>{children}</ChatProvider>
    </SocketProvider>
  );
}
