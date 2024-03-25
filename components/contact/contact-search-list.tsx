import { routes } from "@/constants/routes";
import { useSearchContacts } from "../providers/search-contacts/search-contacts-context";
import { ContactItem } from "./contact-item";
import { useOpenChats } from "../providers/open-chats/open-chats-context";

export function ContactSearchList() {
  const { contacts } = useSearchContacts();
  const { selectedContact } = useOpenChats();

  return contacts?.length ? (
    <>
      {contacts.map((data) => (
        <ContactItem
          key={data.id}
          contact={data}
          href={`${routes.user}/${data.id}`}
          selected={data.id === selectedContact?.id}
          secondLine={
            data.email && (
              <div className="truncate text-nowrap text-sm font-normal text-muted-foreground">
                {data.email}
              </div>
            )
          }
        />
      ))}
    </>
  ) : (
    <div className="p-4 text-center text-sm font-medium text-muted-foreground">
      Nothing was found for your request.
    </div>
  );
}
