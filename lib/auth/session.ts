import { cookies } from "next/headers";
import { lucia } from "./auth";
import { Cookie } from "lucia";

export async function createSession(userId: string) {
  try {
    const session = await lucia.createSession(userId, {});
    setSessionCookie(lucia.createSessionCookie(session.id));

    return session;
  } catch (error) {
    console.error(`Failed to create session: ${String(error)}`);
  }
}

export async function destroySession(sessionId: string) {
  try {
    await lucia.invalidateSession(sessionId);

    setSessionCookie(lucia.createBlankSessionCookie());
  } catch (error) {
    console.error(`Failed to destroy session: ${String(error)}`);
  }
}

export function setSessionCookie(sessionCookie: Cookie) {
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
