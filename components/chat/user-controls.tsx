import { routes } from "@/constants/routes";
import { IconButton } from "../common/icon-button";
import { PhoneIcon } from "../icons/phone-icon";
import { VideoCameraIcon } from "../icons/video-camera-icon";
import { useChat } from "../providers/chat/chat-context";

export function UserControls() {
  const { interlocutor, chat } = useChat();

  const isUser =
    interlocutor?.role === "user" || interlocutor?.role === "admin";

  return (
    !!(isUser && chat) && (
      <>
        <IconButton
          className="group"
          href={`${routes.chatVideo}/${chat.id}`}
          variant="ghost"
          aria-label="Start video call"
          toolTip="Start video call"
          toolTipOffset={10}
          icon={
            <VideoCameraIcon className="h-5 w-5  group-hover:text-primary" />
          }
        />
        <IconButton
          className="group"
          href={`${routes.chatAudio}/${chat.id}`}
          variant="ghost"
          aria-label="Start voice call"
          toolTip="Start voice call"
          toolTipOffset={10}
          icon={<PhoneIcon className="h-5 w-5  group-hover:text-primary" />}
        />
      </>
    )
  );
}
