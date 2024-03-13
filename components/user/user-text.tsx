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
    <div className={cn("ml-1 flex flex-col font-medium", className)} {...props}>
      {username && <span className="truncate">{username}</span>}
      {email && (
        <span
          className={cn(
            "truncate",
            username && "font-normal text-muted-foreground",
            oneLine && username && "hidden"
          )}
        >
          {email}
        </span>
      )}
    </div>
  );
}
