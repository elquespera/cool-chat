import { PropsWithChildren } from "react";
import { ChatProvider } from "./chat/chat-provider";
import { SocketProvider } from "./socket/socket-provider";
import { getAuth } from "@/lib/auth/get-auth";
import { AuthProvider } from "./auth/auth-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();

  return (
    <AuthProvider user={user}>
      <SocketProvider>
        <ChatProvider>{children}</ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
