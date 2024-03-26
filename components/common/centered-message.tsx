import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function CenteredMessage({
  className,
  children,
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex grow flex-col items-center justify-center p-4 text-center text-sm font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
