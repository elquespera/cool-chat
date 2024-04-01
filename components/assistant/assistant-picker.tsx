import { UserAvatar } from "@/components/user/user-avatar";
import { AssistantType, assistantInfo } from "@/constants/assistants";
import { cn } from "@/lib/utils";
import { ToggleOutlineItem } from "../common/toggle-outline-item";
import { ToggleGroup } from "../ui/toggle-group";

type AssistantPickerProps = {
  assistant: AssistantType;
  onAssistantChange: (value: AssistantType) => void;
} & PropsWithClassName;

export function AssistantPicker({
  assistant,
  onAssistantChange,
  className,
}: AssistantPickerProps) {
  return (
    <ToggleGroup
      type="single"
      className={cn("flex flex-wrap justify-center gap-4", className)}
      value={assistant}
      onValueChange={onAssistantChange}
    >
      {Object.values(assistantInfo).map(({ id, username, avatarUrl }) => (
        <ToggleOutlineItem
          key={id}
          value={id}
          className="h-10 w-10 flex-col gap-1 px-3 py-1"
          toolTip={username}
        >
          <UserAvatar avatarUrl={avatarUrl} />
        </ToggleOutlineItem>
      ))}
    </ToggleGroup>
  );
}
