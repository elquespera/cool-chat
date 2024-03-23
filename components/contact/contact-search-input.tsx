"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { InputClearButton } from "../common/input-clear-button";
import { useContacts } from "../providers/contacts/contact-context";
import { InputWrapper } from "../common/input-wrapper";
import { GlassPanel } from "../common/glass-panel";

export function ContactSearchInput() {
  const { searchValue, setSearchValue } = useContacts();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <GlassPanel>
      <h1 className="mb-6 mt-4 px-2 text-5xl font-semibold tracking-tight">
        CoolChat
      </h1>
      <InputWrapper className="mb-4">
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
