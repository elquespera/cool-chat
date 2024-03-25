import { CenteredMessage } from "@/components/common/centered-message";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <CenteredMessage>
      Select a contact to start or continue a conversation.
      <br />
      Use search input to find new users.
    </CenteredMessage>
  );
}
