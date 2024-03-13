import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { AccountInsert, UserInsert, accounts, users } from "../schemas/auth";

export async function addAccount(data: AccountInsert) {
  return db.insert(accounts).values(data).returning().get();
}

export async function addUserAndAccount(
  user: UserInsert,
  account: AccountInsert
) {
  return db.transaction(async (tx) => {
    await tx.insert(users).values(user);
    await tx.insert(accounts).values(account);
  });
}

export async function getAccountById(
  providerId: string,
  providerUserId: string
) {
  return db.query.accounts.findFirst({
    where: and(
      eq(accounts.providerId, providerId),
      eq(accounts.providerUserId, providerUserId)
    ),
  });
}
