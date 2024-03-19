export function createCustomEvent<T extends keyof CustomEventHandlersMap>(
  type: T,
  payload: CustomEventPayload<T>,
) {
  return new CustomEvent(type, { detail: payload });
}
