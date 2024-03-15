type MessageModifiedEvent = CustomEvent<{ chatId: string; messageId: string }>;

interface CustomEventHandlersMap {
  "message-modified": MessageModifiedEvent;
}

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
