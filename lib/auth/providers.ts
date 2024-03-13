import { redirectURIKey, userIdLength } from "@/constants";
import { routes } from "@/constants/routes";
import { addUserAndAccount, getAccountById } from "@/db/actions/accounts";
import {
  Discord,
  Facebook,
  GitHub,
  Google,
  OAuth2Provider,
  OAuth2ProviderWithPKCE,
  OAuth2RequestError,
  Reddit,
  generateCodeVerifier,
  generateState,
} from "arctic";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { createSession } from "./session";

type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string | null;
};

type GoogleUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
};

const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

type AuthProvider = {
  provider: OAuth2Provider | OAuth2ProviderWithPKCE | Google;
  fetchUser: (accessToken: string) => Promise<ProviderUser>;
};

const oauthFetch = async (url: string, accessToken: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });

export const authProviders: Record<string, AuthProvider> = {
  github: {
    provider: github,
    fetchUser: async (accessToken) => {
      const providerResponse = await oauthFetch(
        "https://api.github.com/user",
        accessToken
      );

      const user: GitHubUser = await providerResponse.json();
      return {
        id: String(user.id),
        username: user.login,
        avatarUrl: user.avatar_url,
      };
    },
  },

  google: {
    provider: google,
    fetchUser: async (accessToken) => {
      const providerResponse = await oauthFetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        accessToken
      );

      const user: GoogleUser = await providerResponse.json();
      return {
        id: user.sub,
        username: user.name,
        email: user.email,
        avatarUrl: user.picture,
      };
    },
  },
};

export type AuthProviderId = keyof typeof authProviders;

const providerCookieKeys = {
  state: "lucia_oauth_state",
  codeVerifier: "lucia_oauth_code_verifier",
  uri: "lucia_redirect_uri",
};

export function saveProviderState(
  state: string,
  codeVerifier: string,
  redirectURI?: string | null
) {
  const cookieStore = cookies();
  const providerCookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  } as const;

  cookieStore.set(providerCookieKeys.state, state, providerCookieOptions);
  cookieStore.set(
    providerCookieKeys.codeVerifier,
    codeVerifier,
    providerCookieOptions
  );
  cookieStore.set(
    providerCookieKeys.uri,
    redirectURI ?? routes.home,
    providerCookieOptions
  );
}

export function retrieveProviderState() {
  const cookieStore = cookies();
  return {
    storedState: cookieStore.get(providerCookieKeys.state)?.value ?? null,
    codeVerifier:
      cookieStore.get(providerCookieKeys.codeVerifier)?.value ?? null,
    redirectURI: cookieStore.get(providerCookieKeys.uri)?.value ?? routes.home,
  };
}

type ParamsWithProviderId = { params: { providerId: string } };

export async function generateProviderResponse(
  request: Request,
  { params }: ParamsWithProviderId
) {
  const providerId = params.providerId as AuthProviderId;
  if (!authProviders[providerId]) return badRequest();

  const { provider } = authProviders[providerId];
  const searchParams = new URL(request.url).searchParams;
  const redirectURI = searchParams.get(redirectURIKey);
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  saveProviderState(state, codeVerifier, redirectURI);

  let url: URL | undefined = undefined;
  switch (providerId) {
    case "google":
      url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
      });
      break;

    default:
      url = await provider.createAuthorizationURL(state, codeVerifier);
  }

  return url ? Response.redirect(url) : badRequest();
}

export async function generateProviderCallbackResponse(
  request: Request,
  { params }: ParamsWithProviderId
) {
  const providerId = params.providerId as AuthProviderId;
  if (!authProviders[providerId]) return badRequest();

  const { provider, fetchUser } = authProviders[providerId];

  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const { storedState, codeVerifier, redirectURI } = retrieveProviderState();

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return badRequest();
  }

  const redirect = () =>
    new Response(null, {
      status: 302,
      headers: {
        Location: redirectURI,
      },
    });

  try {
    const tokens = await provider.validateAuthorizationCode(code, codeVerifier);

    const providerUser = await fetchUser(tokens.accessToken);

    const existingAccount = await getAccountById(providerId, providerUser.id);

    if (existingAccount) {
      await createSession(existingAccount.userId);
      return redirect();
    }

    const userId = generateId(userIdLength);

    await addUserAndAccount(
      {
        id: userId,
        providerId,
        username: providerUser.username,
        email: providerUser.email,
        avatarUrl: providerUser.avatarUrl,
      },
      {
        userId,
        providerId,
        providerUserId: providerUser.id,
      }
    );

    await createSession(userId);
    return redirect();
  } catch (e) {
    console.log(String(e));

    if (e instanceof OAuth2RequestError) {
      return badRequest();
    }
    return serverError();
  }
}

const badRequest = () => new Response(null, { status: 400 });
const serverError = () => new Response(null, { status: 500 });
