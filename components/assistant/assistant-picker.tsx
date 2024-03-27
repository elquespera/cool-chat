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
          className="@lg:w-auto h-10 w-10 gap-1 px-3 py-1"
        >
          <UserAvatar avatarUrl={avatarUrl} />
          <span className="@lg:inline hidden">{username}</span>
        </ToggleOutlineItem>
      ))}
    </ToggleGroup>
  );
}
