import { useEffect } from "react";

export function useCustomEvent<T extends keyof CustomEventHandlersMap>(
  type: T,
  onEvent: (payload: CustomEventPayload<T>) => void,
  dependencies: any[] = [],
) {
  useEffect(() => {
    const listener = (event: CustomEventHandlersMap[T]) =>
      onEvent(event.detail);

    window.addEventListener(type, listener);
    return () => removeEventListener(type, listener);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, type]);
}
