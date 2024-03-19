"use client";

import { getUserContacts, searchUsers } from "@/db/actions/users";
import type { ContactUser, ContactUserWithChat } from "@/db/schemas/auth";

import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ContactContext } from "./contact-context";
import { useAuth } from "../auth/auth-context";
import { useCustomEvent } from "@/lib/hooks/use-custom-event";
import { checkMessagesDelivered, updateMessage } from "@/db/actions/messages";
import { useSocket } from "../socket/socket-context";

export function ContactProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const { socket } = useSocket();
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

  const refetchContacts = useMemo(
    () => async () => {
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
    },
    [user],
  );

  useEffect(() => {
    if (!user) return;

    contacts.forEach(async ({ chatId }) => {
      if (!chatId) return;
      const result = await checkMessagesDelivered(chatId);
      if (result.status === "ok" && result.data) {
        const { authorId, chatId, id } = result.data;
        socket?.emit("messageUpdate", {
          messageId: id,
          chatId,
          authorId,
          interlocutorId: user.id,
          status: "delivered",
        });
      }
    });
  }, [contacts, socket, user]);

  useEffect(() => {
    refetchContacts();
  }, [refetchContacts]);

  useCustomEvent(
    "messageupdate",
    async ({ interlocutorId, authorId, messageId, chatId, status }) => {
      if (interlocutorId === user?.id && status === "created") {
        const result = await updateMessage(messageId, { status: "delivered" });

        if (result.status === "ok") {
          socket?.emit("messageUpdate", {
            chatId: chatId,
            messageId,
            authorId,
            interlocutorId,
            status: "delivered",
          });
        }

        refetchContacts();
      }
    },
    [user, socket],
  );

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
