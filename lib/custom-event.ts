export function createCustomEvent<T extends keyof CustomEventHandlersMap>(
  type: T,
  payload?: CustomEventPayload<T>,
) {
  return new CustomEvent(type, { detail: payload });
}

export function dispatchCustomEvent<T extends keyof CustomEventHandlersMap>(
  type: T,
  payload?: CustomEventPayload<T>,
) {
  window.dispatchEvent(createCustomEvent(type, payload));
}
