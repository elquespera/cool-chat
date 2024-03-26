import { routes } from "@/constants/routes";
import { OpenChat } from "@/db/schemas/chats";
import { Timestamp } from "../common/timestamp";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { ContactItem } from "./contact-item";

export function OpenChatList() {
  const { chat, openChats } = useChat();

  return openChats?.length ? (
    <>
      {openChats.map((data) => (
        <ContactItem
          key={data.id}
          contact={data.interlocutor}
          href={`${routes.chat}/${data.id}`}
          selected={data.id === chat?.id}
          status={data.status}
          secondLine={<SecondLine data={data} />}
          endDecoration={<EndDecoration data={data} />}
        />
      ))}
    </>
  ) : (
    <div className="p-4 text-center text-sm font-medium text-muted-foreground">
      You don&apos;t have any contacts. Use search above to find them.
    </div>
  );
}

function SecondLine({ data }: { data: OpenChat }) {
  const { lastMessage, lastAuthor } = data;
  const { user } = useAuth();

  return lastMessage ? (
    <p className="max-w-48 truncate text-sm font-normal text-muted-foreground">
      {lastAuthor === user?.id && <span className="italic">you: </span>}
      {lastMessage}
    </p>
  ) : null;
}

function EndDecoration({ data }: { data: OpenChat }) {
  const { unreadCount, lastTimestamp } = data;

  return lastTimestamp || unreadCount ? (
    <div className="flex flex-col items-end justify-between gap-1">
      <Timestamp
        className="text-nowrap text-sm font-normal text-muted-foreground"
        time={lastTimestamp}
      />

      {!!unreadCount && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground">
          {unreadCount}
        </span>
      )}
    </div>
  ) : null;
}
