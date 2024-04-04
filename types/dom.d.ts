type MessageUpdateEvent = CustomEvent<MessageUpdate>;
type UserStatusChangeEvent = CustomEvent<UserStatusChange>;

type CustomEventHandlersMap = {
  messageupdate: MessageUpdateEvent;
  userstatuschange: UserStatusChangeEvent;
};

type CustomEventPayload<T extends keyof CustomEventHandlersMap> =
  CustomEventHandlersMap[T] extends CustomEvent<infer R> ? R : never;

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
