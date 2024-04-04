"use server";

import { emailMatcher, passwordMatcher, usernameMatcher } from "@/constants";
import { routes } from "@/constants/routes";
import { addUserWithoutAuth as addUser } from "@/db/actions/users";
import { Scrypt } from "lucia";
import { redirect } from "next/navigation";
import { createSession } from "./session";

export async function signUp(
  email: string,
  password: string,
  repeatPassword: string,
  username: string,
  redirectURI: string = routes.home,
): Promise<AuthActionResult> {
  if (password !== repeatPassword) return { error: "Passwords do not match." };

  if (!emailMatcher.test(email)) return { error: "Invalid email." };

  if (!usernameMatcher.test(username))
    return { error: "Username must be at least 4 caracters long." };

  if (!passwordMatcher.test(password))
    return {
      error:
        "Password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number.",
    };

  const hashedPassword = await new Scrypt().hash(password);

  try {
    const user = await addUser({ email, username, hashedPassword });
    if (!user) throw new Error("Can't add user.");
    await createSession(user.id);
  } catch (e) {
    console.error(e);
    return {
      error:
        "An unknown error occurred while creating an account. Please try again later.",
    };
  }

  redirect(redirectURI);
}
