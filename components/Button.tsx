import {
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  View,
} from "react-native";
import { PressableOpacity, PressableOpacityProps } from "./PressableOpacity";
import { forwardRef } from "react";
import { theme } from "../theme";

export interface ButtonProps extends PressableOpacityProps {
  textStyle?:
    | ((state: PressableStateCallbackType) => TextStyle)
    | StyleProp<TextStyle>;
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  { textStyle, children, style, ...props },
  ref
) {
  return (
    <PressableOpacity
      ref={ref}
      {...props}
      style={(state) => [
        {
          backgroundColor: theme.colors.blue,
          paddingHorizontal: theme.spacing["2xl"],
          paddingVertical: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <Text
          style={[
            {
              color: theme.colors.white,
              fontSize: theme.fontSize.md,
              fontWeight: "500",
            },
            typeof textStyle === "function" ? textStyle(state) : textStyle,
          ]}
        >
          {typeof children === "function" ? children(state) : children}
        </Text>
      )}
    </PressableOpacity>
  );
});
