"use client";
import { PropsWithChildren, useMemo, useState } from "react";
import { createContext, useContext } from "react";

type ContactScrollContextType = {
  scrollTop: number;
  setScrollTop: (value: number) => void;
};

const ContactScrollContext = createContext<ContactScrollContextType>({
  scrollTop: 0,
  setScrollTop: () => {},
});

export const useContactScroll = () => useContext(ContactScrollContext);

export function ContactScrollProvider({ children }: PropsWithChildren) {
  const [scrollTop, setScrollTop] = useState(0);

  const value = useMemo(() => ({ scrollTop, setScrollTop }), [scrollTop]);

  return (
    <ContactScrollContext.Provider value={value}>
      {children}
    </ContactScrollContext.Provider>
  );
}
