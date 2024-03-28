"use client";
import { cn } from "@/lib/utils";
import {
  MouseEventHandler,
  ReactNode,
  TouchEventHandler,
  useRef,
  useState,
} from "react";
import { Background } from "../background/background";
import { useChatWindow } from "../providers/chat-window/chat-window-context";
import { useSettings } from "../providers/settings/settings-context";
import { useLocalStorage } from "usehooks-ts";

type ChatWrapperProps = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  minWidth?: number;
  initialWidth?: number;
};

export function ChatWrapper({
  leftPanel,
  rightPanel,
  minWidth = 20,
  initialWidth = 40,
}: ChatWrapperProps) {
  const [leftSize, setLeftSize] = useLocalStorage(
    "coolchat:left-panel-width",
    initialWidth,
  );
  const [isResizing, setIsResizing] = useState(false);
  const { page, isMobile } = useChatWindow();
  const { background } = useSettings();
  const parentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const setWidth = (width: number) =>
    setLeftSize(Math.min(100 - minWidth, Math.max(minWidth, width)));

  const handleMouseDown: MouseEventHandler = (event) => {
    const parent = parentRef.current;
    const left = leftRef.current;
    if (!parent || !left) return;
    event.preventDefault();

    setIsResizing(true);
    let x = event.clientX;
    const leftWidth = left.offsetWidth;
    parent.style.pointerEvents = "none";

    const handleMouseMove = (event: MouseEvent) => {
      document.body.style.cursor = "ew-resize";
      const dx = event.clientX - x;
      const newLeftWidth = ((leftWidth + dx) * 100) / parent.offsetWidth;
      setWidth(newLeftWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      parent.style.pointerEvents = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart: TouchEventHandler = (event) => {
    const parent = parentRef.current;
    const left = leftRef.current;
    if (!parent || !left || !event.touches[0]) return;
    event.preventDefault();
    setIsResizing(true);

    let x = event.touches[0].clientX;
    const leftWidth = left.offsetWidth;

    const handleTouchMove = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      document.body.style.cursor = "ew-resize";
      const dx = event.touches[0].clientX - x;
      const newLeftWidth = ((leftWidth + dx) * 100) / parent.offsetWidth;
      setWidth(newLeftWidth);
    };

    const handleTouchEnd = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      setIsResizing(false);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="relative flex w-[100vw] grow flex-col overflow-clip">
      <div
        ref={parentRef}
        className={cn(
          "absolute inset-0 transition-transform duration-300 sm:flex",
          page === "chat" && "translate-x-[-100vw] sm:translate-x-0",
        )}
      >
        <div
          ref={leftRef}
          className={cn(
            "absolute inset-0 flex w-[100vw] grow flex-col sm:relative sm:w-auto",
          )}
          style={{ width: isMobile ? undefined : `${leftSize}%` }}
        >
          {leftPanel}
        </div>
        <div
          onMouseDown={handleMouseDown}
          onTouchStartCapture={handleTouchStart}
          className={cn("relative z-50 hidden w-[2px] bg-border before:absolute before:inset-y-0 before:left-1/2 before:w-2 before:-translate-x-1/2  before:transition-colors after:absolute after:inset-y-0   after:left-1/2 after:w-4 after:-translate-x-1/2 after:cursor-ew-resize before:hover:bg-border sm:block", isResizing && 'before:bg-border')}
        />
        <Background
          type={background}
          className={cn(
            "absolute inset-0 flex w-[100vw] grow translate-x-[100%] flex-col sm:relative sm:w-auto sm:translate-x-0",
          )}
          style={{ width: isMobile ? undefined : `${100 - leftSize}%` }}
        >
          {rightPanel}
        </Background>
      </div>
    </div>
  );
}
