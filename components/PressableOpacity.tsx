import { Pressable, View } from "react-native";
import { forwardRef } from "react";
import * as Haptics from "expo-haptics";

import type { PressableProps } from "react-native";

export interface PressableOpacityProps
  extends Omit<PressableProps, "onPressIn"> {
  activeOpacity?: number;
  haptic?: Haptics.ImpactFeedbackStyle;
}

export const PressableOpacity = forwardRef<View, PressableOpacityProps>(
  function PressableOpacity(
    { activeOpacity = 0.8, children, disabled, style, haptic, ...props },
    ref
  ) {
    return (
      <Pressable
        ref={ref}
        onPressIn={() =>
          Haptics.impactAsync(haptic ?? Haptics.ImpactFeedbackStyle.Light)
        }
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
