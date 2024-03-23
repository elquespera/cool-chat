import AuthForm from "@/components/auth/auth-form";
import { CenteredWrapper } from "@/components/common/centered-wrapper";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams: { redirectURI, message },
}: AuthPageProps) {
  const { user } = await getAuth();
  if (user) redirect(redirectURI ?? routes.home);

  return (
    <CenteredWrapper className="justify-center">
      <AuthForm type="signIn" redirectURI={redirectURI} message={message} />
    </CenteredWrapper>
  );
}
