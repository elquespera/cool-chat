"use server";

import { emailMatcher, passwordMatcher } from "@/constants";
import { routes } from "@/constants/routes";
import { addUserWithoutAuth as addUser } from "@/db/actions/users";
import { LibsqlError } from "@libsql/client";
import { Scrypt } from "lucia";
import { redirect } from "next/navigation";
import { createSession } from "./session";

export async function signUp(
  email: string,
  password: string,
  username?: string,
  redirectURI: string = routes.home,
): Promise<AuthActionResult> {
  if (!emailMatcher.test(email))
    return {
      error: "Invalid email.",
    };

  if (!passwordMatcher.test(password)) {
    return {
      error:
        "The password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number.",
    };
  }

  const hashedPassword = await new Scrypt().hash(password);

  try {
    const user = await addUser({ email, username, hashedPassword });
    if (!user) throw new Error("Can't add user.");
    await createSession(user.id);
  } catch (e) {
    if ((e as LibsqlError).code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        error:
          "Email already in use. If you already have an account, please sign in using this email.",
      };
    }
    console.error(e);
    return {
      error:
        "An unknown error occurred while creating an account. Please try again later.",
    };
  }

  redirect(redirectURI);
}
