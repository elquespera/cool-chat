import { redirectURIKey } from "@/constants";
import { routes } from "@/constants/routes";

export function formatRedirectURI(
  type: "signIn" | "signUp" | "github" | "google",
  redirectURI: string | undefined,
  ...otherParams: Array<[string, string?]>
) {
  const searchParams = new URLSearchParams();

  if (redirectURI && redirectURI !== routes.home) {
    searchParams.set(redirectURIKey, redirectURI);
  }

  otherParams.forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const params = searchParams.toString();
  const parts: string[] = [routes[type]];
  if (params) parts.push(params);

  return parts.join("?");
}
