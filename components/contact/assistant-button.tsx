import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { IconButton } from "../common/icon-button";
import { AssistantIcon } from "../icons/assistant-icon";
import { useContactScroll } from "./contact-scroll-context";

export function AssistantButton() {
  const { isScrolledDown } = useContactScroll();

  return (
    <div className="absolute inset-y-0 -right-4 flex items-center bg-gradient-to-l from-background via-background to-transparent pe-4 ps-12">
      <IconButton
        href={`${routes.assistant}`}
        aria-label="Assistant"
        toolTip="Assistant"
        toolTipSide="left"
        toolTipOffset={10}
        className={cn(
          "group h-10 w-10 shrink-0 rounded-full transition-all hover:scale-110 hover:shadow-xl",
          isScrolledDown && "h-8 w-8 -translate-y-5",
        )}
        icon={
          <AssistantIcon
            className={cn(
              "h-6 w-6 transition-transform delay-200 group-hover:rotate-180",
              isScrolledDown && "h-4 w-4",
            )}
          />
        }
      />
    </div>
  );
}
