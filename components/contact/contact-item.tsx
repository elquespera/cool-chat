import { ContactUser } from "@/db/schemas/auth";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { ReactNode, useEffect, useRef } from "react";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";

type ContactItemProps = {
  contact: ContactUser;
  status?: UserStatus | null;
  secondLine?: ReactNode;
  endDecoration?: ReactNode;
};

export function ContactItem({
  contact,
  status,
  secondLine,
  endDecoration,
}: ContactItemProps) {
  const { interlocutor, setInterlocutorId } = useChat();

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
      className="group w-full px-3 py-1 sm:px-5"
      onClick={handleContactClick}
    >
      <div className="relative flex items-center justify-between gap-8 rounded-lg bg-message px-4 py-3 transition-colors group-hover:bg-accent group-hover:text-accent-foreground group-aria-selected:bg-message-own group-aria-selected:text-message-own-foreground">
        <UserInfo
          user={contact}
          size="lg"
          oneLine
          status={status ?? undefined}
          secondLine={secondLine}
        />
        {endDecoration}
      </div>
    </button>
  );
}
