import { useCallback, useState } from "react";
import { type TextInputProps as RNTextInputProps } from "react-native";

import { theme } from "../theme";
import { type TextInputProps } from "../components/List/Row";

export function useTextInput({
  placeholder,
  style,
  defaultValue,
  ...props
}: Omit<
  RNTextInputProps,
  "value" | "onChangeText" | "onChange" | "placeholderTextColor"
>): TextInputProps {
  const [value, setValue] = useState<string | undefined>(() => defaultValue);

  const onReset = useCallback(() => {
    setValue(undefined);
  }, [setValue]);

  return {
    placeholder,
    value,
    onChangeText: setValue,
    placeholderTextColor: theme.colors.labels.tertiary,
    onReset,
    style: [
      {
        fontSize: 17,
        lineHeight: 20,
      },
      style,
    ],
    ...props,
  };
}
