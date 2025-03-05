import { SymbolView, SymbolViewProps } from "expo-symbols";
import { forwardRef, useMemo } from "react";
import {
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { theme } from "../theme";
import { hexToRgba, rgbaToHex } from "../utils";
import { PressableOpacity, PressableOpacityProps } from "./PressableOpacity";

export interface ButtonProps extends PressableOpacityProps {
  variant?: "default" | "plain" | "gray" | "tinted" | "filled";
  padding?: boolean;
  fontWeight?: "400" | "500" | "600";
  destructive?: boolean;
  rounded?: boolean;
  leftSymbol?: SymbolViewProps["name"];
  rightSymbol?: SymbolViewProps["name"];
  textStyle?:
    | ((state: PressableStateCallbackType) => StyleProp<TextStyle>)
    | StyleProp<TextStyle>;
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = "default",
    padding = true,
    fontWeight = "600",
    textStyle,
    children,
    style,
    leftSymbol,
    rightSymbol,
    destructive = false,
    rounded = true,
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
      paddingHorizontal: padding ? theme.spacing["2xl"] : 0,
      paddingVertical: padding ? theme.spacing.lg : 0,
      borderRadius: rounded ? theme.borderRadius.lg : undefined,
    };
    let sharedTextStyle: TextStyle = {
      color: theme.colors.white,
      fontSize: theme.fontSize.xl,
      fontWeight,
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
            color: destructive ? theme.colors.red : theme.colors.blue,
          },
        };
      case "plain":
        return {
          container: {
            ...sharedContainerStyle,
          },
          text: {
            ...sharedTextStyle,
            color: destructive ? theme.colors.red : theme.colors.blue,
          },
        };
      case "tinted":
        return {
          container: {
            ...sharedContainerStyle,
            backgroundColor: hexToRgba(
              destructive ? theme.colors.red : theme.colors.blue,
              0.15
            ),
          },
          text: {
            ...sharedTextStyle,
            color: destructive ? theme.colors.red : theme.colors.blue,
          },
        };
      case "filled":
      case "default":
      default:
        return {
          container: {
            ...sharedContainerStyle,
            backgroundColor: destructive ? theme.colors.red : theme.colors.blue,
          },
          text: {
            ...sharedTextStyle,
          },
        };
    }
  }, [variant, padding, fontWeight, destructive, rounded]);

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
