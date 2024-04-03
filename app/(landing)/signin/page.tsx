import AuthForm from "@/components/auth/auth-form";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({ searchParams }: AuthPageProps) {
  const { user } = await getAuth();
  if (user) redirect(searchParams.redirectURI ?? routes.home);

  return <AuthForm type="signIn" {...searchParams} />;
}
