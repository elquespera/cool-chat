import { IconButton } from "@/components/common/icon-button";
import { getAuth } from "@/lib/auth/get-auth";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const { user } = await getAuth();
  if (user) redirect(routes.home);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <IconButton href={routes.signIn}>Sign in</IconButton>
    </main>
  );
}
