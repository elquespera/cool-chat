import AuthForm from "@/components/auth/auth-form";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams: { redirectURI, message },
}: AuthPageProps) {
  const { user } = await getAuth();
  if (user) redirect(redirectURI ?? routes.home);

  return <AuthForm type="signIn" redirectURI={redirectURI} message={message} />;
}
