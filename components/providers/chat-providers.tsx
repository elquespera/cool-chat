import { defaultColor } from "@/constants";
import { getSettings } from "@/db/actions/settings";
import { getAuth } from "@/lib/auth/get-auth";
import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth/auth-provider";
import { ChatWindowProvider } from "./chat-window/chat-window-provider";
import {
  InitialSettings,
  SettingsProvider,
} from "./settings/settings-provider";
import { SocketProvider } from "./socket/socket-provider";

export async function ChatProviders({ children }: PropsWithChildren) {
  const { user } = await getAuth();

  let settings: InitialSettings = { color: defaultColor };

  if (user) {
    const settingsResult = await getSettings(user.id);
    if (settingsResult.ok) {
      settings = settingsResult.data;
    }
  }

  return (
    <AuthProvider user={user}>
      <SettingsProvider initialSettings={settings}>
        <ChatWindowProvider>
          <SocketProvider>{children}</SocketProvider>
        </ChatWindowProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
