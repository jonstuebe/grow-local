import { useEffect, useCallback, useState } from "react";

export function useReactiveQuery<T>(
  query: (callback: (items: T[]) => void) => () => void
) {
  const [state, setState] = useState<T[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [error, setError] = useState<Error | null>(null);

  const callback = useCallback((items: T[]) => {
    setState(items);
    setStatus("success");
  }, []);

  useEffect(() => {
    setStatus("loading");
    let unsub: () => void = () => {};
    try {
      unsub = query(callback);
    } catch (e) {
      setError(e as Error);
      setStatus("error");
    }

    return unsub;
  }, [callback]);

  return {
    status,
    data: state,
    error,
  };
}
