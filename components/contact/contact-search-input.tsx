"use client";

import { ChangeEventHandler } from "react";
import { useContacts } from "./contact-context";

export function ContactSearchInput() {
  const { searchValue, setSearchValue } = useContacts();

  const handleSearchValueChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="p-4 flex w-full border-b">
      <input
        className="max-w-auto w-full"
        placeholder="Search contacts"
        value={searchValue}
        onChange={handleSearchValueChange}
      />
    </div>
  );
}
