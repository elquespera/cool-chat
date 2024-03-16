"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { IconButton } from "../common/icon-button";
import { useAuth } from "../providers/auth/auth-context";
import { AvatarPicker } from "./avatar-picker";
import { LogOutButton } from "./log-out-button";
import { UserInfo } from "./user-info";
import { updateUser } from "@/db/actions/users";
import { useRouter } from "next/navigation";

export function UserPanel() {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pending, setPending] = useState(false);

  const handleSaveClick = async () => {
    if (!user || !avatarUrl) return;
    setPending(true);
    try {
      const result = await updateUser(user.id, { avatarUrl });
      if (result) {
        router.refresh();
        setOpen(false);
      }
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (!open) setAvatarUrl("");
  }, [open]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="absolute bottom-0 w-full border-t bg-background/80 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2">
        {user ? (
          <CollapsibleTrigger asChild>
            <UserInfo
              className="cursor-pointer select-none"
              user={user}
              avatarUrl={avatarUrl}
              status
              self
            />
          </CollapsibleTrigger>
        ) : null}
        <CollapsibleTrigger asChild>
          <IconButton
            className="h-8 w-8"
            toolTip="Settings"
            variant="ghost"
            icon={<DotsVerticalIcon />}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-4">
        <AvatarPicker
          className="mt-4"
          url={avatarUrl}
          onUrlChange={setAvatarUrl}
        />
        <div className="flex gap-2">
          {avatarUrl && (
            <>
              <IconButton
                disabled={pending}
                pending={pending}
                onClick={handleSaveClick}
              >
                Save
              </IconButton>
              <IconButton
                disabled={pending}
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
    </Collapsible>
  );
}
