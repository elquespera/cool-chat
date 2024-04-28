/*** THEME BACKGROUNDS ***/

export const assistants = [
  "tinydolphin",
  "tinyllama",
  "phi3",
  "gemma:2b",
  "qwen",
] as const;

export type AssistantType = (typeof assistants)[number];

export const defaultAssistantType = "phi3";

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
  phi3: {
    id: "phi3",
    username: "Phi-3 Mini",
    description:
      "Phi-3 Mini is a lightweight open model trained with the datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties.",
    avatarUrl: "/assistants/phi3.webp",
    url: "https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/",
  },
  "gemma:2b": {
    id: "gemma:2b",
    username: "Gemma",
    description:
      "Gemma is a new open model developed by Google and its DeepMind team. It’s inspired by Gemini models at Google.",
    avatarUrl: "/assistants/gemma.png",
    url: "https://ai.google.dev/gemma/docs/model_card",
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
