import EmojiMartPicker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { ComponentProps } from "react";

type EmojiPickerProps = Omit<ComponentProps<typeof EmojiMartPicker>, "data">;

export default function EmojiPickerInternal(props: EmojiPickerProps) {
  return <EmojiMartPicker data={emojiData} {...props} />;
}
