export type AssistantStreamReader = ReadableStreamDefaultReader<Uint8Array>;
type StreamEntry = { content?: string; message_id?: string };

export async function readAssistantStream(
  reader: AssistantStreamReader,
  setResponse: (response: string) => void,
  setMessageId: (messageId: string) => void,
) {
  let content = "";
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const entries = decoder.decode(value).split("/n");
    entries.forEach((entry) => {
      try {
        const parsed = JSON.parse(entry) as StreamEntry;
        if (parsed.content) {
          content += parsed.content;
          setResponse(content);
        }
        if (parsed.message_id) {
          setMessageId(parsed.message_id);
        }
      } catch {}
    });
  }
}
