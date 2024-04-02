import { cn } from "@/lib/utils";
import { FadingCirclesIcon } from "../icons/fading-circles-icon";
import { GearAnimatedIcon } from "../icons/gear-animated-icon";
import type { UserStatus } from "@/server/socket-types";

export type StatusIndicatorStatus =
  | UserStatus
  | "pending"
  | "away"
  | "typing"
  | "streaming";

type StatusIndicatorProps = {
  status?: StatusIndicatorStatus;
} & PropsWithClassName;

export const StatusIndicator = ({
  status,
  className,
  ...props
}: StatusIndicatorProps) => {
  return (
    <div
      {...props}
      role="status"
      className={cn(
        "relative flex aspect-square w-2 after:absolute after:inset-0 after:rounded-full",
        status === "pending"
          ? "after:animate-pulse after:bg-muted-foreground"
          : status === "away"
            ? "after:bg-orange-400"
            : status === "online"
              ? "after:bg-emerald-500"
              : status === "offline"
                ? "after:bg-muted-foreground"
                : "",
        className,
      )}
    >
      {status === "streaming" ? (
        <GearAnimatedIcon className="h-full w-full scale-150 text-primary" />
      ) : status === "typing" ? (
        <FadingCirclesIcon className="h-full w-full scale-[2] text-primary" />
      ) : null}
    </div>
  );
};
