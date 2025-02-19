import { useCallback, useState } from "react";

export function useMutation<TArgs extends any[]>(
  mutation: (...args: TArgs) => Promise<any>
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (...args: TArgs) => {
    setStatus("pending");
    try {
      await mutation(...args);
      setStatus("success");
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error as Error);
      setStatus("error");
    }
  }, []);

  return {
    mutate,
    status,
    error,
  };
}
