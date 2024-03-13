"use client";

import { signUp } from "@/lib/auth/sign-up";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { Divider } from "../common/divider";
import { Hint } from "../common/hint";

import { authProvidersInfo } from "@/constants/auth-providers-info";
import { formatRedirectURI } from "@/lib/auth/format-redirect-uri";
import { signIn } from "@/lib/auth/sign-in";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { IconButton } from "../common/icon-button";
import { Button } from "../ui/button";
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
};

export default function AuthForm({
  type,
  redirectURI,
  message,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState<string>();

  const handleSignIn = async () => signIn(email, password, redirectURI);

  const handleSignUp = async () => {
    if (password !== repeatPassword)
      return { error: "Passwords do not match." };

    return signUp(email, password, username, redirectURI);
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    const result =
      type === "signIn" ? await handleSignIn() : await handleSignUp();

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(
        type === "signIn"
          ? "You have been logged in"
          : "You have been successfully registered."
      );
    }

    setError(result?.error);
  };

  return (
    <Card className="max-w-sm self-center">
      <CardHeader>
        <CardTitle>
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
              placeholder="email (required)"
              required
            />
          </div>
          {type === "signUp" && (
            <div
              className={cn(
                "h-0 overflow-hidden transition-all delay-200 duration-500",
                email.length && "h-12 p-1"
              )}
            >
              {!!email.length && (
                <Input
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="username"
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
              placeholder="password (required)"
              required
            />
          </div>
          {type === "signUp" && (
            <div
              className={cn(
                "h-0 overflow-hidden transition-all delay-200 duration-500",
                password.length && "h-12 p-1"
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="mt-4">
            {type === "signIn" ? "Sign In with Email" : "Sign Up with Email"}
          </Button>
        </form>
        <Divider className="my-6">or sign up with</Divider>
        <div className="flex justify-center gap-4">
          {authProvidersInfo.map(({ id, icon: Icon }) => (
            <Hint key={id} className="capitalize" value={id}>
              <IconButton
                variant="outline"
                href={formatRedirectURI(id, redirectURI)}
                className="text-muted-foreground hover:text-accent-foreground"
                aria-label={id}
                icon={<Icon className="h-6 w-6" />}
              />
            </Hint>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {type === "signIn"
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={formatRedirectURI(
              type === "signIn" ? "signUp" : "signIn",
              redirectURI
            )}
            className="font-medium text-muted-foreground hover:text-primary"
          >
            Click here to sign {type === "signIn" ? "up" : "in"}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
