"use server";

import { getAuth } from "@/lib/auth/get-auth";
import { SettingsInsert, SettingsSelect, settings } from "../schemas/settings";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function getSettings(
  userId: string,
): Promise<DBActionResult<SettingsSelect | undefined>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const data = await db.query.settings.findFirst({
    where: eq(settings.userId, userId),
  });

  return { ok: true, data };
}

export async function updateSettings(
  data: Omit<SettingsInsert, "userId">,
): Promise<DBActionResult<SettingsSelect>> {
  const { user } = await getAuth();
  if (!user) return { ok: false, error: "Unauthorized access." };

  const result = await db
    .insert(settings)
    .values({ userId: user.id, ...data })
    .onConflictDoUpdate({
      target: settings.userId,
      set: {
        color: data.color,
        status: data.status,
      },
    })
    .returning()
    .get();

  return { ok: true, data: result };
}
