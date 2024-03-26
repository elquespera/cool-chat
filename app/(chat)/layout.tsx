import { CenteredMessage } from "@/components/common/centered-message";
import { Spinner } from "@/components/common/spinner";
import { ContactList } from "@/components/contact/contact-list";
import { ContactScrollProvider } from "@/components/contact/contact-scroll-context";
import { ContactSearchInput } from "@/components/contact/contact-search-input";
import { ChatProviders } from "@/components/providers/chat-providers";
import { SearchContactsProvider } from "@/components/providers/search-contacts/search-contacts-provider";
import { UserSettings } from "@/components/user/user-settings";
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
      <ChatWrapper
        leftPanel={
          <ContactScrollProvider>
            <SearchContactsProvider>
              <ContactList />
              <ContactSearchInput />
            </SearchContactsProvider>
            <UserSettings />
          </ContactScrollProvider>
        }
        rightPanel={children}
      />
    </ChatProviders>
  );
}

function Loading() {
  return (
    <CenteredMessage>
      <Spinner className="w-6" />
    </CenteredMessage>
  );
}
