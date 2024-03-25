import { ChatInput } from "@/components/chat/chat-input";
import { ChatUser } from "@/components/chat/chat-user";
import { CenteredMessage } from "@/components/common/centered-message";
import { NotFound } from "@/components/common/not-found";
import { Spinner } from "@/components/common/spinner";
import { ContactList } from "@/components/contact/contact-list";
import { ContactScrollProvider } from "@/components/contact/contact-scroll-context";
import { ContactSearchInput } from "@/components/contact/contact-search-input";
import { AssistantProvider } from "@/components/providers/assistant/assistant-provider";
import { ChatProvider } from "@/components/providers/chat/chat-provider";
import { SearchContactsProvider } from "@/components/providers/search-contacts/search-contacts-provider";
import { EmptyRoom } from "@/components/room/empty-room";
import { MediaRoom } from "@/components/room/media-room";
import { TextRoom } from "@/components/room/text-room";
import { UserPanel } from "@/components/user/user-panel";
import { routes } from "@/constants/routes";
import { findChatByIds, getChatById } from "@/db/actions/chats";
import { getAssistantUser, getUserById } from "@/db/actions/users";
import { ContactUser } from "@/db/schemas/auth";
import { ChatSelect, ChatWithUsers } from "@/db/schemas/chats";
import { getAuth } from "@/lib/auth/get-auth";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const ChatWrapper = dynamic(
  () =>
    import("@/components/common/chat-wrapper").then((module) => ({
      default: module.ChatWrapper,
    })),
  { ssr: false, loading: () => <Loading /> },
);

type ChatPageProps = {
  params: {
    fragments?: string[];
  };
};

export default async function ChatPage({
  params: { fragments },
}: ChatPageProps) {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  let interlocutor: ContactUser | null = null;
  let chat: ChatWithUsers | null = null;

  if (!fragments)
    return (
      <Wrapper interlocutor={null} chat={null}>
        <CenteredMessage>
          Select a contact to start or continue a conversation.
          <br />
          Use search input to find new users.
        </CenteredMessage>
      </Wrapper>
    );

  if (fragments[0] !== "user" && fragments[0] !== "chat") return notFound();
  if (fragments.length < 2) return notFound();

  /*** USER SEGMENT ***/
  if (fragments[0] === "user") {
    const response = await getUserById(fragments[1]);
    if (!response.ok)
      return (
        <Wrapper interlocutor={null} chat={null}>
          <NotFound title="User Not Found">
            The user you are looking for was not found.{" "}
          </NotFound>
        </Wrapper>
      );

    interlocutor = response.data;
    const chatResponse = await findChatByIds(user.id, response.data.id);
    if (chatResponse.ok) redirect(`${routes.chat}/${chatResponse.data.id}`);
    return (
      <Wrapper interlocutor={interlocutor} chat={null}>
        <EmptyRoom />
        <ChatInput />
        <ChatUser />
      </Wrapper>
    );
  }

  /*** CHAT SEGMENT ***/
  let chatId = fragments[1];
  let roomType = "text";

  if (fragments.length > 2) {
    roomType = fragments[1];
    chatId = fragments[2];
  }

  if (roomType !== "text" && roomType !== "audio" && roomType !== "video")
    notFound();

  const response = await getChatById(chatId);
  if (!response.ok)
    return (
      <Wrapper interlocutor={null} chat={null}>
        <NotFound title="Chat Not Found">
          The chat you are looking for was not found.
        </NotFound>
      </Wrapper>
    );

  chat = response.data;

  if (chat.userOneId !== user.id && chat.userTwoId !== user.id) notFound();

  interlocutor = chat.userOneId === user.id ? chat.userTwo : chat.userOne;

  console.log(chat.id, interlocutor.id);

  return (
    <Wrapper interlocutor={interlocutor} chat={chat}>
      {roomType === "text" ? <TextRoom /> : <MediaRoom type={roomType} />}
    </Wrapper>
  );
}

type WrapperProps = {
  interlocutor: ContactUser | null;
  chat: ChatSelect | null;
} & PropsWithChildren;

async function Wrapper({ interlocutor, chat, children }: WrapperProps) {
  const assistant = await getAssistantUser();

  return (
    <ChatProvider interlocutor={interlocutor} chat={chat}>
      <AssistantProvider assistant={assistant}>
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
      </AssistantProvider>
    </ChatProvider>
  );
}

function Loading() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <Spinner className="w-6" />
    </div>
  );
}
