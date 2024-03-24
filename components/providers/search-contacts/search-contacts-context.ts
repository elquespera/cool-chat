import type { ContactUser } from "@/db/schemas/auth";
import { createContext, useContext } from "react";

type SearchContactsContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;

  contacts?: ContactUser[];
  error: string;
  isPending: boolean;
};

export const SearchContactsContext = createContext<SearchContactsContextType>({
  searchValue: "",
  setSearchValue: () => {},
  contacts: [],
  error: "",
  isPending: false,
});

export const useSearchContacts = () => useContext(SearchContactsContext);
