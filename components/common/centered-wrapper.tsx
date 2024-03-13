import { cn } from "@/lib/utils";
import { ComponentProps, createElement } from "react";

type CenteredWrapperProps = {
  as?: "div" | "article";
  wide?: boolean;
  margins?: boolean;
  solid?: boolean;
} & ComponentProps<"div">;

export function CenteredWrapper({
  as = "div",
  className,
  wide,
  solid,
  margins,
  children,
  ...props
}: CenteredWrapperProps) {
  return createElement(
    as,
    {
      style: {
        width: `min(100%, var(${
          wide ? "--container-wide" : "--container-normal"
        }))`,
      },
      className: cn(
        "flex grow flex-col self-center p-2 sm:p-4 md:p-8",
        margins && "my-4 md:my-8",
        solid && "border bg-card shadow-md md:rounded-md",
        className
      ),
      ...props,
    },
    children
  );
}
