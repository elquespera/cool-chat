import { UserAvatar } from "@/components/user/user-avatar";
import { AssistantType, assistantInfo } from "@/constants/assistants";
import { ToggleOutlineItem } from "../common/toggle-outline-item";
import { ToggleGroup } from "../ui/toggle-group";

type AssistantPickerProps = {
  assistant: AssistantType;
  onAssistantChange: (value: AssistantType) => void;
};

export function AssistantPicker({
  assistant,
  onAssistantChange,
}: AssistantPickerProps) {
  return (
    <ToggleGroup
      type="single"
      className="flex flex-wrap justify-center gap-4"
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
