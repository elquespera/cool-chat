"use client";
import { routes } from "@/constants/routes";
import { IconButton } from "../common/icon-button";
import { ArrowUpIcon } from "../icons/arrow-up-icon";
import { useChatWindow } from "../providers/chat-window/chat-window-context";

export function BackButton() {
  const { isMobile } = useChatWindow();

  return (
    !!isMobile && (
      <IconButton
        variant="ghost"
        className="absolute left-4 top-5 h-10 w-10"
        aria-label="Back to contacts"
        icon={<ArrowUpIcon className="h-5 w-5 -rotate-90" />}
        href={routes.home}
      />
    )
  );
}
