type AuthActionResult =
  | {
      error?: string;
    }
  | undefined;

type ProviderUser = {
  id: string;
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

type AuthPageProps = {
  searchParams: {
    redirectURI?: string;
    message?: string;
  };
};