import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type UserTextProps = {
  username: string | null;
  email: string | null;
  oneLine?: boolean;
} & ComponentProps<"div">;

export function UserText({
  username,
  email,
  oneLine,
  className,
  ...props
}: UserTextProps) {
  return (
    <div
      className={cn("flex flex-col items-start font-medium", className)}
      {...props}
    >
      {username && <span className="truncate">{username}</span>}
      {email &&
        (oneLine && username ? null : (
          <span
            className={cn(
              "truncate",
              username && "text-[0.875em] font-normal opacity-70",
            )}
          >
            {email}
          </span>
        ))}
    </div>
  );
}
