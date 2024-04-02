import { useSettings } from "@/components/providers/settings/settings-context";

const sounds = {
  click: "/sounds/minimal-pop-click-ui-4.mp3",
  "click-on": "/sounds/minimal-pop-click-ui-5.mp3",
  "click-off": "/sounds/minimal-pop-click-ui-6.mp3",
  refresh: "/sounds/ui-pop-up-8.mp3",
  blip: "/sounds/ui-pop-up-1.mp3",
  "message-alert": "/sounds/cute-level-up-2.mp3",
} as const;

type SoundType = keyof typeof sounds;

export function useSoundEffect(soundType: SoundType) {
  const { sound } = useSettings();

  return (force?: boolean) => {
    if (force === undefined && !sound) return;
    if (force === false) return;

    new Audio(sounds[soundType]).play();
  };
}
