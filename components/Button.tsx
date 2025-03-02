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
  variant?: "default" | "plain";
  textStyle?:
    | ((state: PressableStateCallbackType) => TextStyle)
    | StyleProp<TextStyle>;
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  { variant = "default", textStyle, children, style, ...props },
  ref
) {
  return (
    <PressableOpacity
      ref={ref}
      {...props}
      style={(state) => [
        {
          backgroundColor:
            variant === "default" ? theme.colors.blue : "transparent",
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
              color:
                variant === "default" ? theme.colors.white : theme.colors.blue,
              fontSize: theme.fontSize.xl,
              fontWeight: "600",
              textAlign: "center",
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
