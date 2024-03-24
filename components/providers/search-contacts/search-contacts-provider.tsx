"use client";

import { searchUsers } from "@/db/actions/users";
import type { ContactUser } from "@/db/schemas/auth";
import { PropsWithChildren, useState } from "react";
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

  // const setSearchValue = async (value: string) => {
  //   setPending(true);
  //   try {
  //     setSearchValueInternal(value);
  //     try {
  //       const result = await searchUsers(value);

  //       if (result.ok) {
  //         setFoundContacts(result.data);
  //         setError("");
  //       } else {
  //         setError(result.error);
  //       }
  //     } catch {
  //       setError(
  //         "There was an error fetching contacts. Please try again later.",
  //       );
  //     }
  //   } finally {
  //     setPending(false);
  //   }
  // };

  return (
    <SearchContactsContext.Provider
      value={{
        searchValue,
        setSearchValue,
        contacts,
        error: String(error),
        isPending: isValidating,
      }}
    >
      {children}
    </SearchContactsContext.Provider>
  );
}
