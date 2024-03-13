"use server";

import { getUserByEmail } from "@/db/actions/users";
import { Scrypt } from "lucia";
import { createSession } from "./session";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

export async function signIn(
  email: string,
  password: string,
  redirectURI: string = routes.home
): Promise<AuthActionResult> {
  const user = await getUserByEmail(email);
  if (!user || !user.hashedPassword)
    return { error: "Incorrect username or password" };

  const isPasswordValid = await new Scrypt().verify(
    user.hashedPassword,
    password
  );

  if (!isPasswordValid) return { error: "Incorrect username or password" };

  await createSession(user.id);

  redirect(redirectURI);
}
