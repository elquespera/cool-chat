"use server";

import { emailMatcher, passwordMatcher, userIdLength } from "@/constants";
import { addUser } from "@/db/actions/users";
import { LibsqlError } from "@libsql/client";
import { Scrypt, generateId } from "lucia";
import { createSession } from "./session";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

export async function signUp(
  email: string,
  password: string,
  username?: string,
  redirectURI: string = routes.home
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
  const id = generateId(userIdLength);

  try {
    await addUser({ email, id, username, hashedPassword });
    await createSession(id);
  } catch (e) {
    if (e instanceof LibsqlError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
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
