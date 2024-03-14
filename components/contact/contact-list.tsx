"use client";
import type { ContactUser } from "@/db/schemas/auth";
import { Spinner } from "../common/spinner";
import { useContacts } from "./contact-context";
import { UserAvatar } from "../user/user-avatar";
import { UserText } from "../user/user-text";

export function ContactList() {
  const { contacts, foundContacts, searchValue, pending } = useContacts();

  const contactToDisplay =
    searchValue !== "" || pending ? foundContacts : contacts;

  return (
    <div className="relative bg-muted grow">
      <ul className="divide-y">
        {contactToDisplay.length
          ? contactToDisplay.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))
          : !pending && <EmptyContacts search={searchValue} />}
      </ul>
      {pending && <Spinner className="w-3 absolute top-2 right-2" />}
    </div>
  );
}

function ContactItem({
  contact: { username, avatarUrl, email },
}: {
  contact: ContactUser;
}) {
  return (
    <li className="bg-background">
      <button className="p-2 py-3 flex gap-2 items-center w-full hover:bg-accent">
        <UserAvatar avatarUrl={avatarUrl} providerId={null} className="w-8" />
        <UserText email={email} username={username} oneLine />
      </button>
    </li>
  );
}

function EmptyContacts({ search }: { search: string }) {
  return (
    <div className="p-4 pt-8 text-center text-muted-foreground font-medium text-sm">
      {search
        ? `Nothing was found for your request.`
        : `You don't have any contacts. Use search above to find them.`}
    </div>
  );
}
