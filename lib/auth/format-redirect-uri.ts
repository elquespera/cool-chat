import { authMessageKey, redirectURIKey } from "@/constants";
import { routes } from "@/constants/routes";

export function formatRedirectURI(
  type: "signIn" | "signUp" | "github" | "google",
  redirectURI?: string,
  message?: string
) {
  const searchParams = new URLSearchParams();

  if (redirectURI && redirectURI !== routes.home) {
    searchParams.set(redirectURIKey, redirectURI);
  }

  if (message) {
    searchParams.set(authMessageKey, message);
  }

  const params = searchParams.toString();
  const parts: string[] = [routes[type]];
  if (params) parts.push(params);

  return parts.join("?");
}
