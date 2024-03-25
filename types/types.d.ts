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

type ChatPageProps = { params: { chatId: string } };

type PropsWithClassName = {
  className?: string;
};

type DBActionResult<DataType> =
  | { ok: true; data: DataType }
  | { ok: false; error: string };

type MessageActionType =
  | "created"
  | "updated"
  | "delivered"
  | "read"
  | "deleted";
