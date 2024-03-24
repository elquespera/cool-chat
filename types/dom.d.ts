type MessageUpdateEvent = CustomEvent<{
  chatId: string;
  messageId: string;
  authorId: string;
  interlocutorId: string;
  status: MessageActionType;
}>;

type UserStatusChangeEvent = CustomEvent<{
  userId: string;
  status: UserStatus;
}>;

type AssistantResponseEvent = CustomEvent<{
  chatId: string;
  regenerate?: boolean;
}>;

interface CustomEventHandlersMap {
  chatclick: CustomEvent;
  messageupdate: MessageUpdateEvent;
  assistantresponse: AssistantResponseEvent;
  userstatuschange: UserStatusChangeEvent;
}

type CustomEventPayload<T extends keyof CustomEventHandlersMap> =
  CustomEventHandlersMap[T] extends CustomEvent<infer T> ? T : never;

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
