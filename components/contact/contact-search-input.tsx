"use client";

import { ChangeEventHandler } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useContacts } from "../providers/contacts/contact-context";

export function ContactSearchInput() {
  const { searchValue, setSearchValue } = useContacts();

  const handleSearchValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchValue(event.target.value);
  };

  return (
    <label className="group flex w-full items-center gap-2 border-b p-4">
      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-muted-foreground opacity-50 group-focus-within:opacity-100" />
      <input
        className="min-w-0 grow outline-transparent"
        placeholder="Search contacts"
        value={searchValue}
        onChange={handleSearchValueChange}
      />
    </label>
  );
}
