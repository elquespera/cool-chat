"use client";

import { CenteredMessage } from "@/components/common/centered-message";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { Spinner } from "../common/spinner";

export default function EmptyChat() {
  const { isLoading } = useChatWindow();

  return (
    <CenteredMessage>
      {isLoading ? (
        <Spinner className="w-6" />
      ) : (
        <>
          Please select from one of your contacts to start chatting.
          <br />
          Use search to looks for new contacts.
        </>
      )}
    </CenteredMessage>
  );
}
