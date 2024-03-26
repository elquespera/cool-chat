"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { SettingsInsert, SettingsSelect, settings } from "../schemas/settings";
import { withAuth } from "./with-auth";

export const getSettings = async (userId: string) =>
  withAuth<SettingsSelect>(async () =>
    db.query.settings.findFirst({ where: eq(settings.userId, userId) }),
  );

export const updateSettings = async (data: Omit<SettingsInsert, "userId">) =>
  withAuth<SettingsSelect>(async (user) =>
    db
      .insert(settings)
      .values({ userId: user.id, ...data })
      .onConflictDoUpdate({
        target: settings.userId,
        set: data,
      })
      .returning()
      .get(),
  );
