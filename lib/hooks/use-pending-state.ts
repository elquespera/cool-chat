import { FormEventHandler, useCallback, useState } from "react";

export function usePendingState<Return extends any>(fn: () => Promise<Return>) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>();

  const trigger = useCallback(async () => {
    let result;
    try {
      setIsPending(true);
      result = await fn();
      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setIsPending(false);
    }

    return result;
  }, [fn]);

  return { trigger, isPending, error } as const;
}

export function usePendingFormState<Return extends any>(
  fn: () => Promise<Return>,
) {
  const { trigger: triggerInternal, isPending, error } = usePendingState(fn);

  const trigger: FormEventHandler = async (event) => {
    event.preventDefault();
    await triggerInternal();
  };

  return { trigger, isPending, error } as const;
}
