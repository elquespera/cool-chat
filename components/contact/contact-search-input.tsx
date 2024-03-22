"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ChangeEventHandler, useRef } from "react";
import { InputClearButton } from "../common/input-clear-button";
import { useContacts } from "../providers/contacts/contact-context";

export function ContactSearchInput() {
  const { searchValue, setSearchValue } = useContacts();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="px-4 py-3">
      <div className="group flex items-center gap-2 rounded-3xl bg-accent px-2 py-1 text-accent-foreground transition-colors focus-within:bg-primary/10 dark:focus-within:bg-primary/30">
        <label className="group flex h-8 grow items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-inherit opacity-50 group-focus-within:text-primary/70 group-focus-within:opacity-100 dark:group-focus-within:text-foreground/50" />
          <input
            ref={inputRef}
            className="w-0 min-w-0 grow bg-transparent outline-none outline-transparent group-focus-within:placeholder:text-primary/70 dark:group-focus-within:placeholder:text-foreground/50"
            placeholder="Search contacts"
            value={searchValue}
            onChange={handleSearchValueChange}
          />
        </label>
        <InputClearButton
          inputRef={inputRef}
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </div>
    </div>
  );
}
