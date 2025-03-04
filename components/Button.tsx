import {
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { PressableOpacity, PressableOpacityProps } from "./PressableOpacity";
import { ComponentType, forwardRef, useMemo } from "react";
import { theme } from "../theme";
import { hexToRgba, rgbaToHex } from "../utils";
import { SymbolView, SymbolViewProps } from "expo-symbols";

export interface ButtonProps extends PressableOpacityProps {
  variant?: "default" | "plain" | "gray" | "tinted" | "filled";
  leftSymbol?: SymbolViewProps["name"];
  rightSymbol?: SymbolViewProps["name"];
  textStyle?:
    | ((state: PressableStateCallbackType) => StyleProp<TextStyle>)
    | StyleProp<TextStyle>;
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = "default",
    textStyle,
    children,
    style,
    leftSymbol,
    rightSymbol,
    ...props
  },
  ref
) {
  const styles = useMemo<{
    container: ViewStyle;
    text: TextStyle;
  }>(() => {
    let sharedContainerStyle: ViewStyle = {
      backgroundColor: "transparent",
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    };
    let sharedTextStyle: TextStyle = {
      color: theme.colors.white,
      fontSize: theme.fontSize.xl,
      fontWeight: "600",
      textAlign: "center",
    };

    switch (variant) {
      case "gray":
        return {
          container: {
            ...sharedContainerStyle,
            backgroundColor: theme.colors.fills.tertiary,
          },
          text: {
            ...sharedTextStyle,
            color: theme.colors.blue,
          },
        };
      case "plain":
        return {
          container: {
            ...sharedContainerStyle,
          },
          text: {
            ...sharedTextStyle,
            color: theme.colors.blue,
          },
        };
      case "tinted":
        return {
          container: {
            ...sharedContainerStyle,
            backgroundColor: hexToRgba(theme.colors.blue, 0.15),
          },
          text: {
            ...sharedTextStyle,
            color: theme.colors.blue,
          },
        };
      case "filled":
      case "default":
      default:
        return {
          container: {
            ...sharedContainerStyle,
            backgroundColor: theme.colors.blue,
          },
          text: {
            ...sharedTextStyle,
          },
        };
    }
  }, [variant]);

  return (
    <PressableOpacity
      ref={ref}
      {...props}
      style={(state) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        styles.container,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <>
          {leftSymbol ? (
            <SymbolView
              name={leftSymbol}
              tintColor={rgbaToHex(styles.text.color as string)}
              size={styles.text.fontSize}
            />
          ) : null}
          <Text
            style={[
              styles.text,
              typeof textStyle === "function" ? textStyle(state) : textStyle,
            ]}
          >
            {typeof children === "function" ? children(state) : children}
          </Text>
          {rightSymbol ? (
            <SymbolView
              name={rightSymbol}
              tintColor={rgbaToHex(styles.text.color as string)}
              size={styles.text.fontSize}
            />
          ) : null}
        </>
      )}
    </PressableOpacity>
  );
});
