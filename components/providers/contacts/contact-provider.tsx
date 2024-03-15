"use client";

import { searchUsers } from "@/db/actions/users";
import type { ContactUser } from "@/db/schemas/auth";

import { PropsWithChildren, useState } from "react";
import { ContactContext } from "./contact-context";

export function ContactProvider({ children }: PropsWithChildren) {
  const [searchValue, setSearchValueInternal] = useState("");
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [foundContacts, setFoundContacts] = useState<ContactUser[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const setSearchValue = async (value: string) => {
    setPending(true);
    try {
      setSearchValueInternal(value);
      try {
        const result = await searchUsers(value);

        if (result.status === "ok") {
          setFoundContacts(result.data);
          setError("");
        } else {
          setError(result.error);
        }
      } catch {
        setError(
          "There was an error fetching contacts. Please try again later.",
        );
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        searchValue,
        setSearchValue,
        contacts,
        foundContacts,
        error,
        pending,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
