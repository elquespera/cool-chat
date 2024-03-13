import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type HintProps = {
  value?: ReactNode;
} & ComponentPropsWithoutRef<typeof TooltipContent>;

export const Hint = forwardRef<ElementRef<typeof TooltipContent>, HintProps>(
  ({ children, value, ...props }, ref) => {
    return value ? (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent ref={ref} {...props}>
          {value}
        </TooltipContent>
      </Tooltip>
    ) : (
      children
    );
  }
);
Hint.displayName = "Hint";
