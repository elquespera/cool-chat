/*** THEME BACKGROUNDS ***/

export const assistants = ["tinydolphin", "tinyllama", "qwen"] as const;

export type AssistantType = (typeof assistants)[number];

export const assistantInfo: Record<
  AssistantType,
  {
    id: AssistantType;
    username: string;
    description: string;
    avatarUrl: string;
    url: string;
  }
> = {
  tinydolphin: {
    id: "tinydolphin",
    username: "TinyDolphin",
    description:
      "TinyDolphin is an experimental model from training the TinyLlama model on the popular Dolphin dataset by Eric Hartford.",
    avatarUrl: "/assistants/tinydolphin.jpg",
    url: "https://huggingface.co/cognitivecomputations/TinyDolphin-2.8-1.1b",
  },
  tinyllama: {
    id: "tinyllama",
    username: "TinyLlama",
    description:
      "The TinyLlama project is an open endeavor to train a compact 1.1B Llama model on 3 trillion tokens.",
    avatarUrl: "/assistants/tinyllama.jpg",
    url: "https://github.com/jzhang38/TinyLlama",
  },
  qwen: {
    id: "qwen",
    username: "Qwen",
    description:
      "Qwen is a series of transformer-based large language models by Alibaba Cloud, pre-trained on a large volume of data, including web texts, books, code, etc.",
    avatarUrl: "/assistants/qwen.webp",
    url: "https://github.com/QwenLM/Qwen",
  },
} as const;
