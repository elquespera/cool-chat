import { useCallback, useState } from "react";

export function usePendingState<T extends any>(fn: () => Promise<T>) {
  const [isPending, setIsPending] = useState(false);

  const trigger = useCallback(async () => {
    try {
      setIsPending(true);
      const result = await fn();
      return result;
    } finally {
      setIsPending(false);
    }
  }, [fn]);

  return { isPending, trigger } as const;
}
