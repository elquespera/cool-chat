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

type PropsWithClassName = { className?: string };

type AuthPageProps = {
  searchParams: {
    redirectURI?: string;
    message?: string;
  };
};

type ChatPageProps = { params: { chatId: string } };

type RoomType = "text" | "video" | "audio";

type DBActionResult<DataType> =
  | { ok: true; data: DataType }
  | { ok: false; error: string };

type MessageActionType =
  | "created"
  | "updated"
  | "delivered"
  | "read"
  | "deleted";
