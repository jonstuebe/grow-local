import { useCallback, useState } from "react";
import { type TextInputProps as RNTextInputProps } from "react-native";

import { theme } from "../theme";
import { type TextInputProps } from "../components/List/Row";
import { useTheme } from "react-native-orchard/hooks/useTheme";

export function useTextInput({
  placeholder,
  style,
  defaultValue,
  ...props
}: Omit<
  RNTextInputProps,
  "value" | "onChangeText" | "onChange" | "placeholderTextColor"
>): TextInputProps {
  const { colors } = useTheme();
  const [value, setValue] = useState<string | undefined>(() => defaultValue);

  const onReset = useCallback(() => {
    setValue(undefined);
  }, [setValue]);

  return {
    placeholder,
    value,
    onChangeText: setValue,
    placeholderTextColor: colors.labelVibrantTertiary,
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
