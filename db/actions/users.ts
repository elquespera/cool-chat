import { eq } from "drizzle-orm";
import { db } from "../db";
import { UserInsert, users } from "../schemas/auth";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function addUser(data: UserInsert) {
  return db.insert(users).values(data).returning().get();
}
