"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useChatWindow } from "../providers/chat-window/chat-window-context";

type ChatWrapperProps = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
};

export function ChatWrapper({ leftPanel, rightPanel }: ChatWrapperProps) {
  const { page, isMobile } = useChatWindow();

  return isMobile ? (
    <div className="relative flex w-[100vw] grow flex-col overflow-clip">
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-300",
          page === "chat" && "translate-x-[-100vw]",
        )}
      >
        <div
          key="left-panel"
          className={cn("absolute inset-0 flex w-[100vw] grow flex-col")}
        >
          {leftPanel}
        </div>
        <div
          key="right-panel"
          className={cn(
            "absolute inset-0 flex w-[100vw] grow translate-x-[100%] flex-col",
          )}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  ) : (
    <ResizablePanelGroup
      className="grow"
      direction="horizontal"
      id="chat-window"
    >
      <ResizablePanel
        id="sidebar"
        order={1}
        defaultSize={35}
        minSize={10}
        className="flex grow flex-col"
      >
        <div key="left-panel" className="relative flex grow flex-col">
          {leftPanel}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id="chat"
        order={2}
        defaultSize={65}
        minSize={20}
        className="flex grow flex-col"
      >
        <div key="right-panel" className="relative flex grow flex-col">
          {rightPanel}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
