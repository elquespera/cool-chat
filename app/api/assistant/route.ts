import { assistantId } from "@/constants";
import { ollamaURL } from "@/constants/routes";
import {
  createMessage,
  deleteMessage,
  getMessagesByChatId,
} from "@/db/actions/messages";
import { getAuth } from "@/lib/auth/get-auth";
import { randomUUID } from "crypto";

type OllamaMessage = {
  content: string;
  role: string;
};

type AssistantOptions = {
  chatId: string;
  regenerate?: boolean;
  maxMessages: number;
};

type AssistantReply = {
  done: boolean;
  message: { content: string };
};

const model = "stablelm2";

export const POST = async (request: Request) => {
  const { user } = await getAuth();
  if (!user) return new Response("Not Authorized", { status: 401 });

  const { chatId, maxMessages, regenerate } =
    (await request.json()) as AssistantOptions;

  const rawMessages = await getMessagesByChatId(chatId, 0, maxMessages);

  if (regenerate && rawMessages[0]?.authorId === assistantId) {
    await deleteMessage(rawMessages[0].id);
  }

  if (!rawMessages.length)
    return new Response("No messages found.", { status: 400 });

  const messageId = randomUUID();

  const messages: OllamaMessage[] = rawMessages
    .map(({ content, author }) => ({
      content,
      role: author.role === "assistant" ? "assistant" : "user",
    }))
    .toReversed();

  const response = await fetch(ollamaURL, {
    method: "POST",
    body: JSON.stringify({ model, messages }),
  });

  if (!response.body)
    return new Response("No response from Ollama", { status: 500 });
  const reader = response.body.getReader();
  let message = "";

  const stream = new ReadableStream(
    {
      async start(controller) {
        controller.enqueue(encodeChunk({ message_id: messageId }));
      },

      async pull(controller) {
        const { done, value } = await reader.read();

        if (done) {
          await createMessage({
            id: messageId,
            chatId,
            authorId: assistantId,
            content: message,
          });
          controller.close();
          request.signal.dispatchEvent(new Event("abort"));
        } else {
          const parsed = decodeChunk<AssistantReply>(value);
          const content = parsed?.message?.content;

          if (content) {
            message += content;
            controller.enqueue(encodeChunk({ content }));
          }
        }
      },
    },
    { highWaterMark: 10 },
  );

  return new Response(stream);
};

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

function decodeChunk<T>(chunk?: Uint8Array) {
  if (!chunk) return;

  try {
    return JSON.parse(decoder.decode(chunk)) as T;
  } catch (e) {
    console.error(String(e));
  }
}

function encodeChunk(chunk: any) {
  return encoder.encode(JSON.stringify(chunk) + "/n");
}
