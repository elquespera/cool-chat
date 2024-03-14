import { ContactProvider } from "./contact-context";
import { ContactList } from "./contact-list";
import { ContactSearchInput } from "./contact-search-input";

export function ContactPanel() {
  return (
    <div className="grow flex flex-col">
      <ContactProvider>
        <ContactSearchInput />
        <ContactList />
      </ContactProvider>
    </div>
  );
}
