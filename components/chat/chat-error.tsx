import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ExclamationTriangleIcon } from "../icons/exclamation-triangle-icon";

export function ChatError({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      {...props}
      className={cn(
        "mb-12 flex items-center gap-2 self-center rounded-md border border-destructive bg-destructive-foreground px-4 py-3 text-sm font-medium text-destructive",
        className,
      )}
    >
      <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
      {children}
    </li>
  );
}
