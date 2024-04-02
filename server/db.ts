import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { schema } from "../db/schema";
import { UserStatus } from "./src/socket-types";
import { users } from "../db/schemas/auth";
import { eq } from "drizzle-orm";

const sqlite = new Database(process.env.DB_URL);

export const db = drizzle(sqlite, { schema });

export async function updateUserStatus(userId: string, status: UserStatus) {
  console.log(`User status: ${userId} => ${status}`);
  await db
    .update(users)
    .set({ status: status === "offline" ? "offline" : "online" })
    .where(eq(users.id, userId));
}
