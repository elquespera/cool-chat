"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { InputClearButton } from "../common/input-clear-button";
import { useContacts } from "../providers/contacts/contact-context";
import { InputWrapper } from "../common/input-wrapper";
import { GlassPanel } from "../common/glass-panel";
import { useContactScroll } from "./contact-scroll-context";
import { cn } from "@/lib/utils";
import { ChatDuoIcon } from "../icons/chat-icon";

const threshold = 120;

export function ContactSearchInput() {
  const { scrollTop } = useContactScroll();
  const { searchValue, setSearchValue } = useContacts();
  const inputRef = useRef<HTMLInputElement>(null);

  const isScrolledDown = scrollTop > threshold;

  return (
    <GlassPanel className={cn("overflow-hidden", isScrolledDown && "h-32")}>
      <h1
        className={cn(
          "text-5 mb-6 flex origin-top-left select-none gap-2 overflow-clip px-2 text-5xl font-semibold tracking-tighter transition-all",
          isScrolledDown ? "mt-2 scale-50" : "mt-4 ",
        )}
      >
        <ChatDuoIcon className={cn("shrink-0 text-5xl text-primary")} />
        CoolChat
      </h1>
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
