import { ContactUserWithChat } from "@/db/schemas/auth";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";
import { useEffect, useRef } from "react";

type ContactItemProps = { contact: ContactUserWithChat };

export function ContactItem({ contact }: ContactItemProps) {
  const { interlocutor, setInterlocutorId } = useChat();
  const { unreadCount, lastMessage, lastTimestamp } = contact;
  const ref = useRef<HTMLButtonElement>(null);
  const selected = interlocutor?.id === contact.id;

  const handleContactClick = () => {
    if (selected) {
      setInterlocutorId(null);
    } else {
      setInterlocutorId(contact.id);
      dispatchCustomEvent("chatclick");
    }
  };

  useEffect(() => {
    if (selected)
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [interlocutor, selected]);

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={selected}
      className="group w-full px-4 py-1"
      onClick={handleContactClick}
    >
      <div className="relative flex items-center justify-between gap-8 rounded-lg bg-message px-4 py-3 transition-colors group-hover:bg-accent group-hover:text-accent-foreground group-aria-selected:bg-message-own group-aria-selected:text-message-own-foreground">
        <UserInfo
          user={contact}
          size="lg"
          oneLine
          status
          secondLine={
            lastMessage && (
              <p className="max-w-48 truncate text-sm font-normal text-muted-foreground opacity-70 group-hover:opacity-100">
                {lastMessage}
              </p>
            )
          }
        />
        {(lastTimestamp || unreadCount) && (
          <div className="flex flex-col items-end justify-between gap-1">
            {lastTimestamp && (
              <span className="text-sm font-normal text-muted-foreground opacity-70 group-hover:opacity-100">
                {lastTimestamp.toLocaleTimeString()}
              </span>
            )}

            {!!unreadCount && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
