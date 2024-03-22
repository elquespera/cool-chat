import { ContactUserWithChat } from "@/db/schemas/auth";
import { dispatchCustomEvent } from "@/lib/custom-event";
import { useChat } from "../providers/chat/chat-context";
import { UserInfo } from "../user/user-info";

type ContactItemProps = { contact: ContactUserWithChat };

export function ContactItem({ contact }: ContactItemProps) {
  const { interlocutor, setInterlocutorId } = useChat();

  const handleContactClick = () => {
    setInterlocutorId(contact.id);
    dispatchCustomEvent("chatclick");
  };

  return (
    <li className="bg-background">
      <button
        role="option"
        aria-selected={interlocutor?.id === contact.id}
        className="relative flex w-full items-center gap-2 p-2 py-3 hover:bg-accent hover:text-accent-foreground aria-selected:bg-primary/10 aria-selected:text-accent-foreground"
        onClick={handleContactClick}
      >
        <UserInfo user={contact} oneLine status />
        {!!contact?.unseenMessages && (
          <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground">
            {contact?.unseenMessages}
          </span>
        )}
      </button>
    </li>
  );
}
