import { ContactProvider } from "./contact-context";
import { ContactList } from "./contact-list";
import { ContactSearchInput } from "./contact-search-input";

export function ContactPanel() {
  return (
    <ContactProvider>
      <div className="flex grow flex-col">
        <ContactSearchInput />
        <ContactList />
      </div>
    </ContactProvider>
  );
}
