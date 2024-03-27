"use server";

import { and, eq, like, ne, or } from "drizzle-orm";
import { db } from "../db";
import {
  ContactUser,
  UserInsert,
  contactUserColumns,
  contactUserFilter,
  users,
} from "../schemas/auth";
import { withAuth } from "./with-auth";

// Auth Actions without Authentication
export async function getUserByEmailOrUsername(emailOrUsername: string) {
  return db.query.users.findFirst({
    where: or(
      eq(users.email, emailOrUsername),
      eq(users.username, emailOrUsername),
    ),
  });
}

export async function addUserWithoutAuth(data: UserInsert) {
  return db.insert(users).values(data).returning().get();
}

// Wiht Auth
export const getUserById = async (id: string) =>
  withAuth<ContactUser>(
    async () =>
      await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: contactUserFilter,
      }),
  );

export const searchUsers = async (searchValue: string) =>
  withAuth<ContactUser[]>(async (user) => {
    if (!searchValue.length) return [];
    const search = `${searchValue}%`;

    return db.query.users.findMany({
      where: and(
        or(like(users.email, search), like(users.username, search)),
        ne(users.id, user.id),
      ),
      columns: contactUserFilter,
    });
  });

export const addUser = async (data: UserInsert) =>
  withAuth<ContactUser>(async () =>
    db.insert(users).values(data).returning(contactUserColumns).get(),
  );

export const updateUser = async (userId: string, data: UserInsert) =>
  withAuth<ContactUser>(async () =>
    db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning(contactUserColumns)
      .get(),
  );
