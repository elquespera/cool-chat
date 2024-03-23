"use client";
import { assistantId } from "@/constants";
import { createCustomEvent } from "@/lib/custom-event";
import { IconButton } from "../common/icon-button";
import { Spinner } from "../common/spinner";
import { AssistantIcon } from "../icons/assistant-icon";
import { useChat } from "../providers/chat/chat-context";
import { useContacts } from "../providers/contacts/contact-context";
import { ScrollArea } from "../ui/scroll-area";
import { ContactItem } from "./contact-item";
import { GlassPanel } from "../common/glass-panel";
import { cn } from "@/lib/utils";

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
          <div
            role="listbox"
            aria-label="Contacts"
            className={cn("grow pt-48", !hideAssistant && "pb-20")}
          >
            {contactToDisplay.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </div>
        )}
        {pending && <Spinner className="absolute right-2 top-2 w-3" />}
      </ScrollArea>
      {!hideAssistant && (
        <GlassPanel
          position="bottom"
          className="flex h-20 items-center justify-center"
        >
          <IconButton
            icon={<AssistantIcon className="h-4 w-4" />}
            onClick={() => {
              setInterlocutorId(assistantId);
              window.dispatchEvent(createCustomEvent("chatclick", {}));
            }}
          >
            Talk to Assistant
          </IconButton>
        </GlassPanel>
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
