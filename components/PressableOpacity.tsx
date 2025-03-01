import { Pressable, View } from "react-native";
import type { PressableProps } from "react-native";
import { forwardRef } from "react";

export interface PressableOpacityProps extends PressableProps {
  activeOpacity?: number;
}

export const PressableOpacity = forwardRef<View, PressableOpacityProps>(
  function PressableOpacity(
    { activeOpacity = 0.8, children, disabled, style, ...props },
    ref
  ) {
    return (
      <Pressable
        ref={ref}
        style={(state) => [
          {
            opacity: state.pressed || disabled ? activeOpacity : undefined,
          },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);
