"use client";
import { assistantId, interlocutorKey } from "@/constants";
import { IconButton } from "../common/icon-button";
import { Spinner } from "../common/spinner";
import { useContacts } from "../providers/contacts/contact-context";
import { ScrollArea } from "../ui/scroll-area";
import { ContactItem } from "./contact-item";
import { AssistantIcon } from "../icons/assistant-icon";
import { useChat } from "../providers/chat/chat-context";
import { createCustomEvent } from "@/lib/custom-event";

export function ContactList() {
  const { contacts, foundContacts, searchValue, pending, error } =
    useContacts();

  const { interlocutor, setInterlocutorId } = useChat();
  const hideAssistant =
    interlocutor?.role === "assistant" ||
    contacts.find(({ role }) => role === "assistant");

  const contactToDisplay =
    searchValue !== "" || pending ? foundContacts : contacts;

  return (
    <div className="relative grow">
      <ScrollArea
        className="inset-0 flex flex-col"
        style={{ position: "absolute" }}
      >
        {!contactToDisplay.length || error ? (
          <EmptyContacts search={searchValue} error={error} />
        ) : (
          <ul className="grow divide-y pb-20">
            {contactToDisplay.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </ul>
        )}
        {pending && <Spinner className="absolute right-2 top-2 w-3" />}
      </ScrollArea>
      {!hideAssistant && (
        <div className="absolute bottom-0 flex h-20 w-full items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <IconButton
            icon={<AssistantIcon className="h-4 w-4" />}
            onClick={() => {
              setInterlocutorId(assistantId);
              window.dispatchEvent(createCustomEvent("chatclick", {}));
            }}
          >
            Talk to Assistant
          </IconButton>
        </div>
      )}
    </div>
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
