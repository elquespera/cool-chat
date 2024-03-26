"use client";
import { PropsWithChildren, useMemo, useState } from "react";
import { createContext, useContext } from "react";

const threshold = 120;

type ContactScrollContextType = {
  scrollTop: number;
  isScrolledDown: boolean;
  setScrollTop: (value: number) => void;
};

const ContactScrollContext = createContext<ContactScrollContextType>({
  scrollTop: 0,
  isScrolledDown: false,
  setScrollTop: () => {},
});

export const useContactScroll = () => useContext(ContactScrollContext);

export function ContactScrollProvider({ children }: PropsWithChildren) {
  const [scrollTop, setScrollTop] = useState(0);

  const value = useMemo(
    () => ({ scrollTop, setScrollTop, isScrolledDown: scrollTop > threshold }),
    [scrollTop],
  );

  return (
    <ContactScrollContext.Provider value={value}>
      {children}
    </ContactScrollContext.Provider>
  );
}
