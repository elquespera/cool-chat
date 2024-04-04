import { Spinner } from "@/components/common/spinner";
import { ContactList } from "@/components/contact/contact-list";
import { ContactScrollProvider } from "@/components/contact/contact-scroll-context";
import { ContactSearchInput } from "@/components/contact/contact-search-input";
import { ChatProviders } from "@/components/providers/chat-providers";
import { SearchContactsProvider } from "@/components/providers/search-contacts/search-contacts-provider";
import { UserSettings } from "@/components/user/user-settings";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const ChatWrapper = dynamic(
  () =>
    import("@/components/common/chat-wrapper").then((module) => ({
      default: module.ChatWrapper,
    })),
  { ssr: false, loading: () => <Loading /> },
);

export default async function ChatLayout({ children }: PropsWithChildren) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

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
    <div className="flex grow select-none flex-col items-center justify-center">
      <Spinner className="w-6" />
    </div>
  );
}
