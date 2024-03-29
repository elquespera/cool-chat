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

interface CustomEventHandlersMap {
  chatclick: CustomEvent;
  messageupdate: MessageUpdateEvent;
  userstatuschange: UserStatusChangeEvent;
}

type CustomEventPayload<T extends keyof CustomEventHandlersMap> =
  CustomEventHandlersMap[T] extends CustomEvent<infer T> ? T : never;

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
