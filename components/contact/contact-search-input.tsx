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
    <div className="border-b px-4 py-3">
      <div className="flex items-center gap-2 rounded-3xl bg-muted px-2 py-1">
        <label className="group flex h-8 grow items-center gap-2">
          <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-muted-foreground opacity-50 group-focus-within:opacity-100" />
          <input
            ref={inputRef}
            className="w-0 min-w-0 grow bg-transparent outline-none outline-transparent"
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
