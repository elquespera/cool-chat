"use client";
import { Spinner } from "../common/spinner";
import { useContacts } from "../providers/contacts/contact-context";
import { ScrollArea } from "../ui/scroll-area";
import { ContactItem } from "./contact-item";

export function ContactList() {
  const { contacts, foundContacts, searchValue, pending, error } =
    useContacts();

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
