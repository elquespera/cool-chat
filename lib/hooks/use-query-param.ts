"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useQueryParam(name: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValueInternal] = useState<string | null>(
    searchParams?.get(name) ?? null,
  );

  const createQueryString = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams, name],
  );

  useEffect(() => {
    setValueInternal(searchParams?.get(name) ?? null);
  }, [name, searchParams]);

  const setValue = (value: string | null) => {
    setValueInternal(value);
    router.push(`${pathname}?${createQueryString(value)}`);
  };

  return [value, setValue] as const;
}
