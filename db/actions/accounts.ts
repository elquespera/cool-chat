import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { AccountInsert, UserInsert, accounts, users } from "../schemas/auth";

export async function addAccount(data: AccountInsert) {
  return db.insert(accounts).values(data).returning().get();
}

export async function addUserAndAccount(
  user: UserInsert,
  account: Omit<AccountInsert, "userId">,
) {
  return db.transaction(async (tx) => {
    const newUser = await tx.insert(users).values(user).returning().get();
    await tx.insert(accounts).values({ userId: newUser.id, ...account });
    return newUser;
  });
}

export async function getAccountById(
  providerId: string,
  providerUserId: string,
) {
  return db.query.accounts.findFirst({
    where: and(
      eq(accounts.providerId, providerId),
      eq(accounts.providerUserId, providerUserId),
    ),
  });
}
