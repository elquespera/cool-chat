"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { User } from "lucia";

export async function withAuth<T>(
  dbAction: (user: User) => Promise<T | undefined | null>,
  notFoundMsg = "Data not found",
): Promise<DBActionResult<T>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  try {
    const data = await dbAction(user);
    if (data) return { ok: true, data };
  } catch (error) {
    console.error(error);
    return { ok: false, error: String(error) };
  }

  return { ok: false, error: notFoundMsg };
}
