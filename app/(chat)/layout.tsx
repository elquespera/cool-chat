import { Spinner } from "@/components/common/spinner";
import { ContactList } from "@/components/contact/contact-list";
import { ContactScrollProvider } from "@/components/contact/contact-scroll-context";
import { ContactSearchInput } from "@/components/contact/contact-search-input";
import { ChatProviders } from "@/components/providers/chat-providers";
import { SearchContactsProvider } from "@/components/providers/search-contacts/search-contacts-provider";
import { UserPanel } from "@/components/user/user-panel";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const ChatWrapper = dynamic(
  () =>
    import("@/components/common/chat-wrapper").then((module) => ({
      default: module.ChatWrapper,
    })),
  { ssr: false, loading: () => <Loading /> },
);

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <ChatProviders>
      <main className="flex max-h-[100%] grow flex-col">
        <ChatWrapper
          leftPanel={
            <ContactScrollProvider>
              <SearchContactsProvider>
                <ContactList />
                <ContactSearchInput />
              </SearchContactsProvider>
              <UserPanel />
            </ContactScrollProvider>
          }
          rightPanel={children}
        />
      </main>
    </ChatProviders>
  );
}

function Loading() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <Spinner className="w-6" />
    </div>
  );
}
