"use client";

import { searchUsers } from "@/db/actions/users";
import type { ContactUser } from "@/db/schemas/auth";

import { PropsWithChildren, createContext, useContext, useState } from "react";

type ContactContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  contacts: ContactUser[];
  foundContacts: ContactUser[];
  pending: boolean;
};

const ContactContext = createContext<ContactContextType>({
  searchValue: "",
  setSearchValue: () => {},
  contacts: [],
  foundContacts: [],
  pending: false,
});

export function ContactProvider({ children }: PropsWithChildren) {
  const [searchValue, setSearchValueInternal] = useState("");
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [foundContacts, setFoundContacts] = useState<ContactUser[]>([]);
  const [pending, setPending] = useState(false);

  const setSearchValue = async (value: string) => {
    setPending(true);
    try {
      setSearchValueInternal(value);
      setFoundContacts(await searchUsers(value));
    } finally {
      setPending(false);
    }
  };

  return (
    <ContactContext.Provider
      value={{ searchValue, setSearchValue, contacts, foundContacts, pending }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export const useContacts = () => useContext(ContactContext);
