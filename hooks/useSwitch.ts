import { useCallback, useState } from "react";

export function useSwitch(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return { value, onValueChange: toggle };
}
