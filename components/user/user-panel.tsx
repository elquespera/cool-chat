import { SocketIndicator } from "@/components/common/socket-indicator";
import { getAuth } from "@/lib/auth/get-auth";
import { UserAvatar } from "./user-avatar";
import { UserText } from "./user-text";
import { LogOutButton } from "./log-out-button";

export async function UserPanel({}) {
  const { user } = await getAuth();
  if (!user) return null;

  return (
    <div className="p-4 flex gap-2 items-center absolute bottom-0 w-full bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          providerId={user.providerId}
          className="w-10"
        />
        <SocketIndicator className="absolute w-2.5 right-0 top-0" />
      </div>
      <UserText email={user.email} username={user.username} />
      <LogOutButton className="ml-auto" />
    </div>
  );
}
