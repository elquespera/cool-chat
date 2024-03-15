import { ContactList } from "./contact-list";
import { ContactSearchInput } from "./contact-search-input";

export function ContactPanel() {
  return (
    <div className="flex grow flex-col">
      <ContactSearchInput />
      <ContactList />
    </div>
  );
}
