"use server";
import { getAuth } from "./get-auth";
import { destroySession } from "./session";

export async function signOut(): Promise<AuthActionResult> {
  const { session } = await getAuth();
  if (!session) return { error: "Unauthorized" };

  destroySession(session.id);
}
