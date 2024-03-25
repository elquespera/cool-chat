"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";
import { CenteredMessage } from "../common/centered-message";

const MediaRoomInternal = dynamic(
  () =>
    import("./media-room-internal").then((module) => ({
      default: module.MediaRoom,
    })),
  { loading: () => <CenteredMessage>Initializing chat...</CenteredMessage> },
);

export function MediaRoom(props: ComponentProps<typeof MediaRoomInternal>) {
  return <MediaRoomInternal {...props} />;
}
