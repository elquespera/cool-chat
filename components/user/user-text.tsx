import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type UserTextProps = {
  username: string | null;
  email: string | null;
  oneLine?: boolean;
  secondLine?: ReactNode;
} & ComponentProps<"div">;

export function UserText({
  username,
  email,
  oneLine,
  secondLine,
  className,
  ...props
}: UserTextProps) {
  return (
    <div
      className={cn("overflow-hidden text-start font-medium", className)}
      {...props}
    >
      {username && <div className="truncate">{username}</div>}
      {email &&
        (username && (oneLine || secondLine) ? null : (
          <div
            className={cn(
              "truncate",
              username && "text-[0.875em] font-normal opacity-70",
            )}
          >
            {email}
          </div>
        ))}
      {secondLine}
    </div>
  );
}
