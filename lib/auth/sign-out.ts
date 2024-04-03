"use server";
import { deleteUser } from "@/db/actions/users";
import { getAuth } from "./get-auth";
import { destroySession } from "./session";

export async function signOut(): Promise<AuthActionResult> {
  const { session, user } = await getAuth();
  if (!session || !user) return { error: "Unauthorized" };

  if (user.role === "anonymous") {
    await deleteUser(user.id);
  }

  await destroySession(session.id);
}
