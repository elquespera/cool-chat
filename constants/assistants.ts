/*** THEME BACKGROUNDS ***/

export const assistants = ["qwen", "tinyllama", "tinydolphin"] as const;

export type AssistantType = (typeof assistants)[number];

export const assistantInfo: Record<
  AssistantType,
  {
    id: string;
    username: string;
    description: string;
    avatarUrl: string;
    url: string;
  }
> = {
  qwen: {
    id: "qwen",
    username: "Qwen",
    description: "",
    avatarUrl: "/assistants/qwen.webp",
    url: "https://github.com/QwenLM/Qwen",
  },
  tinyllama: {
    id: "tinyllama",
    username: "TinyLlama",
    description:
      "The TinyLlama project is an open endeavor to train a compact 1.1B Llama model on 3 trillion tokens.",
    avatarUrl: "/assistants/tinyllama.jpg",
    url: "https://github.com/jzhang38/TinyLlama",
  },
  tinydolphin: {
    id: "tinydolphin",
    username: "TinyDolphin",
    description:
      "TinyDolphin is an experimental model from training the TinyLlama model on the popular Dolphin dataset by Eric Hartford.",
    avatarUrl: "/assistants/tinydolphin.jpg",
    url: "https://huggingface.co/cognitivecomputations/TinyDolphin-2.8-1.1b",
  },
} as const;
