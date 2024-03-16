"use client";

import { PropsWithChildren } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IconButton } from "../common/icon-button";
import { LogOutButton } from "./log-out-button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

type UserSettingsProps = {} & PropsWithChildren;
export function UserSettings({ children }: UserSettingsProps) {
  return (
    <Collapsible>
      <div className="flex justify-between gap-2">
        {children}
        <CollapsibleTrigger asChild>
          <IconButton
            className="h-8 w-8"
            toolTip="Settings"
            variant="ghost"
            icon={<DotsVerticalIcon />}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col">
        <div className="h-40"></div>
        <LogOutButton className="ml-auto" />
      </CollapsibleContent>
    </Collapsible>
  );
}
