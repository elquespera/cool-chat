"use client";
import { assistantId } from "@/constants";
import { cn } from "@/lib/utils";
import { Spinner } from "../common/spinner";
import { useChat } from "../providers/chat/chat-context";
import { useSearchContacts } from "../providers/search-contacts/search-contacts-context";
import { ScrollArea } from "../ui/scroll-area";
import { AssistantCTA } from "./assistant-cta";
import { useContactScroll } from "./contact-scroll-context";
import { ContactSearchList } from "./contact-search-list";
import { OpenChatList } from "./open-chat-list";

export function ContactList() {
  const { setScrollTop } = useContactScroll();
  const { searchValue, isPending } = useSearchContacts();
  const { interlocutor } = useChat();
  const showAssistant = interlocutor?.id !== assistantId;

  return (
    <div className="relative grow">
      <ScrollArea
        className="inset-0 flex flex-col"
        style={{ position: "absolute" }}
        onScrollCapture={(event) =>
          setScrollTop((event.target as HTMLElement).scrollTop)
        }
      >
        <div
          className={cn("grow pb-2 pt-48", showAssistant ? "pb-40" : "pb-20")}
        >
          <div role="listbox" aria-label="Contacts">
            {searchValue === "" ? <OpenChatList /> : <ContactSearchList />}
          </div>
          {isPending && <Spinner className="absolute right-2 top-2 w-3" />}
        </div>
      </ScrollArea>
      <AssistantCTA show={showAssistant} />
    </div>
  );
}
