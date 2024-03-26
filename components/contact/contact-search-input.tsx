"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { GlassPanel } from "../common/glass-panel";
import { InputClearButton } from "../common/input-clear-button";
import { InputWrapper } from "../common/input-wrapper";
import { ChatDuoIcon } from "../icons/chat-icon";
import { useContactScroll } from "./contact-scroll-context";
import { MagnifyingGlassIcon } from "../icons/magnifying-glass-icon";
import { useSearchContacts } from "../providers/search-contacts/search-contacts-context";
import { AssistantButton } from "./assistant-button";

export function ContactSearchInput() {
  const { searchValue, setSearchValue } = useSearchContacts();
  const { isScrolledDown } = useContactScroll();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <GlassPanel
      className={cn("overflow-hidden", isScrolledDown && "h-32 shadow-sm")}
    >
      <div className="flex items-center justify-between gap-2">
        <h1
          className={cn(
            "text-5 gap- mb-6 flex origin-top-left select-none items-center px-2 text-5xl font-semibold tracking-tighter transition-all",
            isScrolledDown ? "mt-2 scale-50" : "mt-4 ",
          )}
        >
          <ChatDuoIcon className={cn("shrink-0 text-5xl text-primary")} />
          CoolChat
        </h1>
        <AssistantButton />
      </div>
      <InputWrapper
        className={cn(
          "mb-4 transition-transform",
          isScrolledDown && "-translate-y-9",
        )}
      >
        <label className="group flex h-9 grow items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-inherit opacity-50 group-focus-within:text-primary/70 group-focus-within:opacity-100 dark:group-focus-within:text-foreground/50" />
          <input
            ref={inputRef}
            className="grow"
            placeholder="Search contacts"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </label>
        <InputClearButton
          inputRef={inputRef}
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </InputWrapper>
    </GlassPanel>
  );
}
