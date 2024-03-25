"use client";

import { searchUsers } from "@/db/actions/users";
import type { ContactUser } from "@/db/schemas/auth";
import { PropsWithChildren, useMemo, useState } from "react";
import useSWR from "swr";
import { SearchContactsContext } from "./search-contacts-context";

export function SearchContactsProvider({ children }: PropsWithChildren) {
  const [searchValue, setSearchValue] = useState("");

  const {
    data: contacts,
    isValidating,
    error,
  } = useSWR<ContactUser[]>(searchValue, async (search: string) => {
    const result = await searchUsers(search);
    return result.ok ? result.data : [];
  });

  const value = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      contacts,
      error: String(error),
      isPending: isValidating,
    }),
    [searchValue, contacts, isValidating, error],
  );

  return (
    <SearchContactsContext.Provider value={value}>
      {children}
    </SearchContactsContext.Provider>
  );
}
