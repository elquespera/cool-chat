import type { ContactUser } from "@/db/schemas/auth";
import { createContext, useContext } from "react";

type ContactContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  contacts: ContactUser[];
  foundContacts: ContactUser[];
  error: string;
  pending: boolean;
};

export const ContactContext = createContext<ContactContextType>({
  searchValue: "",
  setSearchValue: () => {},
  contacts: [],
  foundContacts: [],
  error: "",
  pending: false,
});

export const useContacts = () => useContext(ContactContext);
