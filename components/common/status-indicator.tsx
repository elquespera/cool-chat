import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type StatusIndicatorProps = {
  status?: "online" | "pending" | "away" | "offline" | "typing";
} & ComponentProps<"div">;

export const StatusIndicator = ({
  status,
  className,
  ...props
}: StatusIndicatorProps) => {
  return status ? (
    <div
      {...props}
      role="status"
      className={cn(
        "aspect-square w-2 rounded-full",
        status === "pending"
          ? "animate-pulse bg-muted-foreground"
          : status === "away"
            ? "bg-orange-400"
            : status === "online"
              ? "bg-emerald-500"
              : "bg-muted-foreground",
        className,
      )}
    />
  ) : null;
};
