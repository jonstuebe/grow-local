import { useCallback, useEffect, useState } from "react";

type PromiseStatus = "idle" | "pending" | "fulfilled" | "rejected";

interface UsePromiseOptions {
  enabled?: boolean;
}

export function usePromise<TResponse, TArgs extends any[] | undefined>(
  promiseFn: TArgs extends any[]
    ? (...args: TArgs) => Promise<TResponse>
    : () => Promise<TResponse>,
  args?: TArgs,
  { enabled = true }: UsePromiseOptions = { enabled: true }
) {
  const [status, setStatus] = useState<PromiseStatus>("idle");
  const [result, setResult] = useState<TResponse | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    const executePromise = async () => {
      setStatus("pending");
      try {
        const response = args ? await promiseFn(...args) : await promiseFn();
        if (isMounted) {
          setResult(response);
          setStatus("fulfilled");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus("rejected");
        }
      }
    };

    executePromise();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  const refetch = useCallback(async () => {
    let isMounted = true;

    setStatus("pending");
    try {
      const response = args ? await promiseFn(...args) : await promiseFn();
      if (isMounted) {
        setResult(response);
        setStatus("fulfilled");
      }
    } catch (err) {
      if (isMounted) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("rejected");
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    result,

    status,
    error,

    refetch,
  };
}
