import { getAuth } from "@/lib/auth/get-auth";
import { UserInfo } from "./user-info";
import { UserSettings } from "./user-settings";

export async function UserPanel({}) {
  const { user } = await getAuth();
  if (!user) return null;

  return (
    <div className="absolute bottom-0 w-full border-t bg-background/80 p-4 backdrop-blur-sm">
      <UserSettings>
        <UserInfo user={user} status self />
      </UserSettings>
    </div>
  );
}
