import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { ChatWindow } from "@/components/chat/chat-window";
import { Spinner } from "@/components/common/spinner";
import { ContactList } from "@/components/contact/contact-list";
import { ContactScrollProvider } from "@/components/contact/contact-scroll-context";
import { ContactSearchInput } from "@/components/contact/contact-search-input";
import { UserPanel } from "@/components/user/user-panel";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ChatWrapper = dynamic(
  () =>
    import("@/components/common/chat-wrapper").then((module) => ({
      default: module.ChatWrapper,
    })),
  { ssr: false, loading: () => <Loading /> },
);

export default async function HomePage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatWrapper
      leftPanel={
        <ContactScrollProvider>
          <ContactList />
          <ContactSearchInput />
          <UserPanel />
        </ContactScrollProvider>
      }
      rightPanel={
        <>
          <ChatWindow />
          <ChatInput />
          <ChatUser />
        </>
      }
    />
  );
}

function Loading() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <Spinner className="w-6" />
    </div>
  );
}