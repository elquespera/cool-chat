import { MessageStatus as MessageStatusType } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { CheckIcon } from "../icons/check-icon";

type MessageStatusProps = {
  status: MessageStatusType | null;
} & ComponentProps<"div">;

export function MessageStatus({
  status,
  className,
  ...props
}: MessageStatusProps) {
  return (
    <div
      {...props}
      className={cn("relative flex min-h-4 min-w-5 items-center", className)}
    >
      <CheckIcon
        className={cn(
          "absolute text-muted-foreground opacity-50",
          status === "read" && "text-primary opacity-100",
        )}
      />
      {(status === "delivered" || status === "read") && (
        <CheckIcon
          className={cn(
            "absolute translate-x-1 text-muted-foreground opacity-50",
            status === "read" && "text-primary opacity-100",
          )}
        />
      )}
    </div>
  );
}
