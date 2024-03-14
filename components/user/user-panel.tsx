import { getAuth } from "@/lib/auth/get-auth";
import { LogOutButton } from "./log-out-button";
import { UserInfo } from "./user-info";

export async function UserPanel({}) {
  const { user } = await getAuth();
  if (!user) return null;

  return (
    <div className="absolute bottom-0 flex w-full items-center gap-2 border-t bg-background/80 p-4 backdrop-blur-sm">
      <UserInfo user={user} status self />
      <LogOutButton className="ml-auto" />
    </div>
  );
}
