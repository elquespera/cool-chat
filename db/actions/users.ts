import { eq, or } from "drizzle-orm";
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
