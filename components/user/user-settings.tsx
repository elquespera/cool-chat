"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeColor } from "@/constants/theme-color";
import { createMockConversation } from "@/db/actions/mock";
import { updateSettings } from "@/db/actions/settings";
import { updateUser } from "@/db/actions/users";
import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { ChatConversationIcon } from "../icons/chat-conversation-icon";
import { ChevronUpIcon } from "../icons/chevron-up-icon";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { useMessages } from "../providers/message/message-context";
import { useSettings } from "../providers/settings/settings-context";
import { AvatarPicker } from "./avatar-picker";
import { ColorPicker } from "./color-picker";
import { LogOutButton } from "./log-out-button";
import ThemeSwitch from "./theme-switch";
import { UserInfo } from "./user-info";
import SoundSwitch from "./sound-switch";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";
import { BackgroundPicker } from "./background-picker";
import { ThemeBackground } from "@/constants/theme-background";

export function UserSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const { color, setColor, background, setBackground } = useSettings();
  const { refetchMessages } = useMessages();
  const { refetchOpenChats } = useChat();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [savedColor, setSavedColor] = useState<ThemeColor>(color);
  const [savedBackground, setSavedBackground] =
    useState<ThemeBackground>(background);
  const playClickOn = useSoundEffect("click-on");
  const playClickOff = useSoundEffect("click-off");

  const touched =
    !!avatarUrl || savedColor !== color || savedBackground !== background;

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    try {
      if (color !== savedColor || background !== savedBackground) {
        const result = await updateSettings({ color, background });
        setSavedColor(result.ok ? result.data.color : savedColor);
        setSavedBackground(
          result.ok ? result.data.background : savedBackground,
        );
      }

      if (avatarUrl) {
        const result = await updateUser(user.id, { avatarUrl });
        if (result) {
          refetchMessages();
          router.refresh();
        }
      }

      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  const handleMockConversationClick = async () => {
    const result = await createMockConversation();
    if (result.ok) {
      refetchOpenChats();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSavedColor(color);
      setSavedBackground(background);
      playClickOn();
    } else {
      setColor(savedColor);
      setBackground(savedBackground);
      setAvatarUrl("");
      playClickOff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!user) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="absolute bottom-0 w-full bg-background p-4 shadow-top"
    >
      <div className="relative isolate flex h-10 items-center gap-2">
        <CollapsibleTrigger className="peer cursor-pointer select-none before:absolute before:inset-0">
          <UserInfo user={user} avatarUrl={avatarUrl} status self />
        </CollapsibleTrigger>
        <SoundSwitch className="ml-auto" />
        <ThemeSwitch />
        <ChevronUpIcon className="-z-10 mx-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform delay-300 duration-200 peer-data-[state=open]:rotate-180" />
      </div>
      <CollapsibleContent asChild>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <ColorPicker className="mt-4" color={color} setColor={setColor} />
          <BackgroundPicker
            background={background}
            setBackground={setBackground}
          />
          <AvatarPicker url={avatarUrl} onUrlChange={setAvatarUrl} />
          <div className="mb-2 flex justify-end">
            <IconButton
              type="button"
              size="sm"
              onClick={handleMockConversationClick}
              icon={<ChatConversationIcon />}
            >
              Create mock chat
            </IconButton>
          </div>
          <div className="flex gap-4">
            <IconButton
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Restore
            </IconButton>
            {touched && (
              <IconButton
                type="submit"
                size="sm"
                disabled={pending}
                pending={pending}
              >
                Save
              </IconButton>
            )}
            <LogOutButton className="ml-auto" />
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
