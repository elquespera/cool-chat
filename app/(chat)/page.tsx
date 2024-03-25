import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <div className="flex grow flex-col justify-center">
      <p className="p-4 text-center text-sm font-medium text-muted-foreground">
        Select a contact to start or continue a conversation.
        <br />
        Use search input to find new users.
      </p>
    </div>
  );
}
