type MessageModifiedEvent = CustomEvent<{ chatId: string; messageId: string }>;

interface CustomEventHandlersMap {
  "message-modified": MessageModifiedEvent;
  chatclick: CustomEvent;
}

interface GlobalEventHandlersEventMap extends CustomEventHandlersMap {}
