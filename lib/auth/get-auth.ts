import { cookies } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";
import { lucia } from "./auth";
import { setSessionCookie } from "./session";

type AuthObject =
  | { user: User; session: Session }
  | { user: null; session: null };

export const getAuth = cache(async (): Promise<AuthObject> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      setSessionCookie(lucia.createSessionCookie(result.session.id));
    }
    if (!result.session) {
      setSessionCookie(lucia.createBlankSessionCookie());
    }
  } catch {}

  return result;
});
