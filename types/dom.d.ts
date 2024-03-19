type MessageUpdateEvent = CustomEvent<{
  chatId: string;
  messageId: string;
  authorId: string;
  interlocutorId: string;
  status: MessageActionType;
}>;

interface CustomEventHandlersMap {
  chatclick: CustomEvent;
  messageupdate: MessageUpdateEvent;
}

type CustomEventPayload<T extends keyof CustomEventHandlersMap> =
  CustomEventHandlersMap[T] extends CustomEvent<infer T> ? T : never;

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
