import { useSearchContacts } from "../providers/search-contacts/search-contacts-context";
import { ContactItem } from "./contact-item";

export function ContactSearchList() {
  const { contacts } = useSearchContacts();

  return contacts?.length ? (
    <>
      {contacts.map((data) => (
        <ContactItem
          key={data.id}
          contact={data}
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
