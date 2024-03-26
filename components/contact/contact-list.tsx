"use client";
import { Spinner } from "../common/spinner";
import { useSearchContacts } from "../providers/search-contacts/search-contacts-context";
import { ScrollArea } from "../ui/scroll-area";
import { useContactScroll } from "./contact-scroll-context";
import { ContactSearchList } from "./contact-search-list";
import { OpenChatList } from "./open-chat-list";

export function ContactList() {
  const { setScrollTop } = useContactScroll();
  const { searchValue, isPending } = useSearchContacts();

  return (
    <div className="relative grow">
      <ScrollArea
        className="inset-0 flex flex-col"
        style={{ position: "absolute" }}
        onScrollCapture={(event) =>
          setScrollTop((event.target as HTMLElement).scrollTop)
        }
      >
        <div className="grow pb-20 pt-48">
          <div role="listbox" aria-label="Contacts">
            {searchValue === "" ? <OpenChatList /> : <ContactSearchList />}
          </div>
          {isPending && <Spinner className="absolute right-2 top-2 w-3" />}
        </div>
      </ScrollArea>
    </div>
  );
}
