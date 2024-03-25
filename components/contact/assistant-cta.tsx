import { assistantId } from "@/constants";
import { routes } from "@/constants/routes";
import { GlassPanel } from "../common/glass-panel";
import { IconButton } from "../common/icon-button";
import { AssistantIcon } from "../icons/assistant-icon";

type AssistantCTAProps = { show: boolean };

export function AssistantCTA({ show }: AssistantCTAProps) {
  return show ? (
    <GlassPanel
      position="bottom"
      className="bottom-[4.5rem] flex h-20 items-center justify-center"
    >
      <IconButton
        icon={<AssistantIcon className="h-4 w-4" />}
        href={`${routes.user}/${assistantId}`}
      >
        Talk to Assistant
      </IconButton>
    </GlassPanel>
  ) : null;
}
