import { ChatProviders } from "@/components/providers/chat-providers";
import { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return <ChatProviders>{children}</ChatProviders>;
}
