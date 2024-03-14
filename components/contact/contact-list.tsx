"use client";
import type { ContactUser } from "@/db/schemas/auth";
import { Spinner } from "../common/spinner";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user/user-avatar";
import { UserText } from "../user/user-text";
import { useContacts } from "./contact-context";
import { useChat } from "../providers/chat/chat-context";

export function ContactList() {
  const { contacts, foundContacts, searchValue, pending, error } =
    useContacts();

  const contactToDisplay =
    searchValue !== "" || pending ? foundContacts : contacts;

  return (
    <div className="relative grow">
      <ScrollArea className="inset-0" style={{ position: "absolute" }}>
        {!contactToDisplay.length || error ? (
          <EmptyContacts search={searchValue} error={error} />
        ) : (
          <ul className="divide-y pb-20">
            {contactToDisplay.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </ul>
        )}
        {pending && <Spinner className="absolute right-2 top-2 w-3" />}
      </ScrollArea>
    </div>
  );
}

function ContactItem({ contact }: { contact: ContactUser }) {
  const { interlocutor, setIntercolutor } = useChat();
  const { id, username, avatarUrl, email } = contact;
  const handleContactClick = () => setIntercolutor(contact);

  return (
    <li className="bg-background">
      <button
        role="option"
        aria-selected={interlocutor?.id === id}
        className="flex w-full items-center gap-2 p-2 py-3 hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
        onClick={handleContactClick}
      >
        <UserAvatar avatarUrl={avatarUrl} providerId={null} className="w-8" />
        <UserText email={email} username={username} oneLine />
      </button>
    </li>
  );
}

function EmptyContacts({ search, error }: { search: string; error: string }) {
  return (
    <div className="p-4 pb-24 pt-8 text-center text-sm font-medium text-muted-foreground">
      {error ? (
        <span className="text-destructive">{error}</span>
      ) : search ? (
        `Nothing was found for your request.`
      ) : (
        `You don't have any contacts. Use search above to find them.`
      )}
    </div>
  );
}
