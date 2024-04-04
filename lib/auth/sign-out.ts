"use server";
import { routes } from "@/constants/routes";
import { deleteUser } from "@/db/actions/users";
import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import { destroySession } from "./session";
import { wait } from "../utils";

export async function signOut(): Promise<AuthActionResult> {
  const { session, user } = await getAuth();
  if (!session || !user) return { error: "Unauthorized" };

  if (user.role === "anonymous") {
    await deleteUser(user.id);
  }

  await destroySession(session.id);
  await wait(500);

  redirect(routes.welcome);
}
