"use client";

import { getUserContacts, searchUsers } from "@/db/actions/users";
import type { ContactUser, ContactUserWithChat } from "@/db/schemas/auth";

import { PropsWithChildren, useEffect, useState } from "react";
import { ContactContext } from "./contact-context";
import { useAuth } from "../auth/auth-context";

export function ContactProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [searchValue, setSearchValueInternal] = useState("");
  const [contacts, setContacts] = useState<ContactUserWithChat[]>([]);
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

  const refetchContacts = async () => {
    if (user) {
      const result = await getUserContacts();

      try {
        if (result.status === "ok") {
          setContacts(result.data);
          setError("");
        } else {
          setError(result.error);
        }
      } catch {
        setError(
          "There was an error fetching contacts. Please try again later.",
        );
      }
    } else {
      setContacts([]);
    }
  };

  useEffect(() => {
    refetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
