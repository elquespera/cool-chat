"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeColor } from "@/constants";
import { createMockConversation } from "@/db/actions/mock";
import { updateUser } from "@/db/actions/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { useAuth } from "../providers/auth/auth-context";
import { useColors } from "../providers/color/color-context";
import { AvatarPicker } from "./avatar-picker";
import { ColorPicker } from "./color-picker";
import { LogOutButton } from "./log-out-button";
import ThemeSwitch from "./theme-switch";
import { UserInfo } from "./user-info";
import { GlassPanel } from "../common/glass-panel";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export function UserPanel() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { color, setColor } = useColors();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [savedColor, setSavedColor] = useState<ThemeColor>(color);

  const handleSaveClick = async () => {
    if (!user) return;
    setPending(true);
    try {
      if (color !== savedColor) {
        setSavedColor(color);
      }

      if (avatarUrl) {
        const result = await updateUser(user.id, { avatarUrl });
        if (result) {
          router.refresh();
        }
      }

      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  const handleMockConversationClick = async () => {
    await createMockConversation();
    router.refresh();
    setOpen(false);
  };

  const handleColorChange = (color: ThemeColor) => setColor(color);

  useEffect(() => {
    setOpen(open);

    if (open) {
      setSavedColor(color);
    } else {
      setColor(savedColor);
      setAvatarUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!user) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <GlassPanel position="bottom" className="shadow-top">
        <div className="relative flex h-10 items-center gap-2">
          <CollapsibleTrigger asChild>
            <UserInfo
              className="peer cursor-pointer select-none before:absolute before:inset-0"
              user={user}
              avatarUrl={avatarUrl}
              status
              self
            />
          </CollapsibleTrigger>
          <ThemeSwitch className="ml-auto" />
          <ChevronDownIcon className="-z-10 mx-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform delay-300 duration-200 peer-data-[state=open]:rotate-180" />
        </div>
        <CollapsibleContent className="flex flex-col gap-3">
          <ColorPicker
            className="mt-4"
            color={color}
            setColor={handleColorChange}
          />
          <AvatarPicker url={avatarUrl} onUrlChange={setAvatarUrl} />
          {isAdmin && (
            <div className="mb-2 flex justify-end">
              <IconButton size="sm" onClick={handleMockConversationClick}>
                Generate mock conversation
              </IconButton>
            </div>
          )}
          <div className="flex gap-2">
            {(avatarUrl || savedColor !== color) && (
              <>
                <IconButton
                  size="sm"
                  disabled={pending}
                  pending={pending}
                  onClick={handleSaveClick}
                >
                  Save
                </IconButton>
                <IconButton
                  disabled={pending}
                  size="sm"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </IconButton>
              </>
            )}
            <LogOutButton className="ml-auto" />
          </div>
        </CollapsibleContent>
      </GlassPanel>
    </Collapsible>
  );
}
