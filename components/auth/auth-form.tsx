"use client";

import personFemale from "@/assets/images/person-female.svg";
import personMale from "@/assets/images/person-male.svg";
import { signUp } from "@/lib/auth/sign-up";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Divider } from "../common/divider";

import { authProvidersInfo } from "@/constants/auth-providers-info";
import { formatRedirectURI } from "@/lib/auth/format-redirect-uri";
import { signIn } from "@/lib/auth/sign-in";
import { signUpAsAnonymous } from "@/lib/auth/sign-up-as-anonymous";
import { usePendingFormState } from "@/lib/hooks/use-pending-state";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconButton } from "../common/icon-button";
import { AnonymousIcon } from "../icons/anonymous-icon";
import { ExclamationTriangleIcon } from "../icons/exclamation-triangle-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

type AuthFormProps = {
  type: "signIn" | "signUp";
  redirectURI?: string;
  message?: string;
  email?: string;
};

export default function AuthForm({
  type,
  redirectURI,
  message,
  email: defaultEmail,
}: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const {
    trigger: handleSubmit,
    isPending,
    error,
  } = usePendingFormState(async () => {
    const result =
      type === "signIn"
        ? await signIn(email, password, redirectURI)
        : await signUp(
            email.trim(),
            password,
            repeatPassword,
            username.trim(),
            redirectURI,
          );
    if (result?.error) throw new Error(result.error);
  });

  return (
    <div className="relative flex grow flex-col items-center justify-center overflow-x-hidden px-4 pt-12">
      <Image
        priority
        src={personMale}
        alt="Male Person"
        className="absolute max-h-72 -translate-y-3 translate-x-[max(-200px,-35vw)]"
      />

      <Image
        src={personFemale}
        alt="Female Person"
        className="absolute max-h-72 translate-x-[min(45vw,260px)] translate-y-20"
      />
      <Card className="relative max-w-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl">
            {type === "signIn" ? "Log in" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {message && (
              <p className="my-4 flex items-center gap-2 rounded-md border border-destructive px-3 py-2 text-sm font-medium text-destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {message}
              </p>
            )}
            Use an email and password or one of the social accounts you have.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="overflow-hidden p-1">
              <Input
                autoFocus
                name="email"
                type={type === "signUp" ? "email" : "text"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={type === "signUp" ? "email (required)" : "email"}
                required
              />
            </div>
            {type === "signUp" && (
              <div
                className={cn(
                  "h-0 overflow-hidden transition-all delay-200 duration-500",
                  email.length && "h-12 p-1",
                )}
              >
                {!!email.length && (
                  <Input
                    name="username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={
                      type === "signUp" ? "username (required)" : "username"
                    }
                  />
                )}
              </div>
            )}
            <div className="overflow-hidden p-1">
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  type === "signUp" ? "password (required)" : "password"
                }
                required
              />
            </div>
            {type === "signUp" && (
              <div
                className={cn(
                  "h-0 overflow-hidden transition-all delay-200 duration-500",
                  password.length && "h-12 p-1",
                )}
              >
                {!!password.length && (
                  <Input
                    name="repeat_password"
                    type="password"
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                    placeholder="repeat password"
                    required
                  />
                )}
              </div>
            )}
            {error instanceof Error && (
              <p className="px-2 text-sm text-destructive">
                {String(error.message)}
              </p>
            )}
            <IconButton type="submit" className="mt-4" pending={isPending}>
              {type === "signIn" ? "Sign In" : "Sign Up with Email"}
            </IconButton>
          </form>
          <Divider className="my-6">or continue with</Divider>
          <div className="flex justify-center gap-5">
            {authProvidersInfo.map(({ id, icon: Icon }) => (
              <IconButton
                key={id}
                variant="outline"
                toolTip={<span className="capitalize">{id}</span>}
                toolTipOffset={10}
                className="h-12 w-12 text-muted-foreground hover:text-primary"
                aria-label={id}
                icon={<Icon className="h-7 w-7" />}
                onClick={() => router.push(formatRedirectURI(id, redirectURI))}
              />
            ))}

            <IconButton
              variant="outline"
              toolTip="Anonymous User"
              aria-label="Anonymous user"
              toolTipOffset={10}
              className="h-12 w-12 text-muted-foreground hover:text-primary"
              icon={<AnonymousIcon className="h-7 w-7" />}
              onClick={() => signUpAsAnonymous()}
            />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {type === "signIn"
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <Link
              href={formatRedirectURI(
                type === "signIn" ? "signUp" : "signIn",
                redirectURI,
                ["message", message],
                ["email", email],
              )}
              className="font-medium text-muted-foreground hover:text-primary"
            >
              Click here to sign {type === "signIn" ? "up" : "in"}
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
