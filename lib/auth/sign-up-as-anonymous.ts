"use server";

import { routes } from "@/constants/routes";
import { addUserWithoutAuth as addUser } from "@/db/actions/users";
import { LibsqlError } from "@libsql/client";
import { redirect } from "next/navigation";
import { createSession } from "./session";
import { randomUser } from "@/lib/random/random-user";

export async function signUpAsAnonymous(
  redirectURI: string = routes.home,
): Promise<AuthActionResult> {
  try {
    const user = await addUser({ ...randomUser(), role: "anonymous" });

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
