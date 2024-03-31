/*** THEME BACKGROUNDS ***/

export const assistants = [
  "tinydolphin",
  "tinyllama",
  "gemma:2b",
  "qwen",
  "knoopx/llava-phi-2:3b-q8_0",
] as const;

export type AssistantType = (typeof assistants)[number];

export const defaultAssistantType = "gemma:2b";

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
  "knoopx/llava-phi-2:3b-q8_0": {
    id: "knoopx/llava-phi-2:3b-q8_0",
    username: "Llava Phi 2",
    description:
      "LLaVA is an open-source chatbot trained by fine-tuning Phi-2 on GPT-generated multimodal instruction-following data. It is an auto-regressive language model, based on the transformer architecture.",
    avatarUrl: "/assistants/llava.webp",
    url: "https://huggingface.co/kejcao/llava-phi-2-GGUF",
  },
} as const;
