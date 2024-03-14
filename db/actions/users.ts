"use server";

import { eq, like, or } from "drizzle-orm";
import { db } from "../db";
import { UserInsert, users } from "../schemas/auth";

export async function getUserByEmailOrUsername(emailOrUsername: string) {
  return db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername)
    ),
  });
}

export async function addUser(data: UserInsert) {
  return db.insert(users).values(data).returning().get();
}

export async function searchUsers(searchValue: string) {
  if (!searchValue.length) return [];

  const search = `${searchValue}%`;

  return db.query.users.findMany({
    where: or(like(users.email, search), like(users.username, search)),
    columns: { hashedPassword: false, providerId: false },
  });
}
