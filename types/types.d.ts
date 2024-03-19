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

type PropsWithClassName = {
  className?: string;
};

type DBActionResult<DataType> =
  | { status: "error"; error: string }
  | { status: "ok"; data: DataType };

type MessageActionType =
  | "created"
  | "updated"
  | "delivered"
  | "read"
  | "deleted";
