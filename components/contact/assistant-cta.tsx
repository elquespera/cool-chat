import { assistantId } from "@/constants";
import { createCustomEvent } from "@/lib/custom-event";
import { GlassPanel } from "../common/glass-panel";
import { IconButton } from "../common/icon-button";
import { AssistantIcon } from "../icons/assistant-icon";
import { useChat } from "../providers/chat/chat-context";

type AssistantCTAProps = { show: boolean };

export function AssistantCTA({ show }: AssistantCTAProps) {
  // const { setInterlocutorId } = useChat();

  return show ? (
    <GlassPanel
      position="bottom"
      className="bottom-[4.5rem] flex h-20 items-center justify-center"
    >
      <IconButton
        icon={<AssistantIcon className="h-4 w-4" />}
        onClick={() => {
          // setInterlocutorId(assistantId);
          window.dispatchEvent(createCustomEvent("chatclick"));
        }}
      >
        Talk to Assistant
      </IconButton>
    </GlassPanel>
  ) : null;
}
