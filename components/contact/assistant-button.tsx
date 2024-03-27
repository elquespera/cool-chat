import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { IconButton } from "../common/icon-button";
import { AssistantIcon } from "../icons/assistant-icon";
import { useContactScroll } from "./contact-scroll-context";

export function AssistantButton() {
  const { isScrolledDown } = useContactScroll();

  return (
    <IconButton
      href={`${routes.assistant}`}
      aria-label="Assistant"
      toolTip="Assistant"
      toolTipSide="left"
      className={cn(
        "absolute right-4 h-10 w-10 shrink-0 rounded-full transition-all",
        isScrolledDown && "h-8 w-8 -translate-y-5",
      )}
      icon={
        <AssistantIcon className={cn("h-6 w-6", isScrolledDown && "h-4 w-4")} />
      }
    />
  );
}
