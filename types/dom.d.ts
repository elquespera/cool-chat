type MessageModifiedEvent = CustomEvent<{ chatId: string; messageId: string }>;

type MessageStatusUpdateEvent = CustomEvent<{
  messageId: string;
  status: string;
}>;

interface CustomEventHandlersMap {
  chatclick: CustomEvent;
  messagemodified: MessageModifiedEvent;
  messagestatusupdate: MessageStatusUpdateEvent;
}

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
