export function createCustomEvent<T extends keyof CustomEventHandlersMap>(
  type: T,
  payload: CustomEventHandlersMap[T] extends CustomEvent<infer T> ? T : never,
) {
  return new CustomEvent(type, { detail: payload });
}
