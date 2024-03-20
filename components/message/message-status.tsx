import { MessageStatus as MessageStatusType } from "@/db/schemas/messages";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";

type MessageStatusProps = {
  status: MessageStatusType | null;
};

export function MessageStatus({ status }: MessageStatusProps) {
  return (
    <span className="relative h-4 w-5">
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
    </span>
  );
}
