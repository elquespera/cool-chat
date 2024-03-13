import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type DividerProps = {
  align?: "start" | "end" | "center";
} & ComponentProps<"div">;

export function Divider({
  align = "center",
  children,
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 text-sm uppercase leading-none text-muted-foreground",
        (align === "end" || align === "center") &&
          "before:relative before:grow before:border-t",
        (align === "start" || align === "center") &&
          "after:relative after:grow after:border-t",
        className
      )}
    >
      {children}
    </div>
  );
}
