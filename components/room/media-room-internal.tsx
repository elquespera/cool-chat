"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { routes } from "@/constants/routes";
import { useAuth } from "../providers/auth/auth-context";
import { useChat } from "../providers/chat/chat-context";
import { useRouter } from "next/navigation";
import { CenteredMessage } from "../common/centered-message";

type MediaRoomProps = {
  type: "video" | "audio";
};

export function MediaRoom({ type }: MediaRoomProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { chat } = useChat();
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      if (!user || !chat) {
        setToken("");
        return;
      }

      const name = `${user.username}${user.email ? " " + user.email : ""}`;

      try {
        const resp = await fetch(
          `${routes.getLivekitToken}?room=${chat.id}&username=${name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch {
        setToken("");
      }
    };

    getToken();
  }, [user, chat]);

  if (!token) {
    return <CenteredMessage>Initializing chat...</CenteredMessage>;
  }

  return (
    <div className="flex grow flex-col justify-center">
      <LiveKitRoom
        video={type === "video"}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        onDisconnected={() => router.push(`${routes.chat}/${chat?.id}`)}
      >
        <VideoConference />
        <RoomAudioRenderer />
        <ControlBar
          variation="minimal"
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
          }}
        />
      </LiveKitRoom>
    </div>
  );
}

function VideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
