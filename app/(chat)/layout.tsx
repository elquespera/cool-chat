import { ChatProviders } from "@/components/providers/chat-providers";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProviders>
      <main className="flex max-h-[100%] grow flex-col">{children}</main>
    </ChatProviders>
  );
}
