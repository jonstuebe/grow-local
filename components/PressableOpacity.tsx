import { Pressable } from "react-native";

import { PressableProps } from "react-native";

export interface PressableOpacityProps extends PressableProps {
  activeOpacity?: number;
}

export const PressableOpacity = ({
  activeOpacity = 0.8,
  children,
  style,
  ...props
}: PressableOpacityProps) => {
  return (
    <Pressable
      style={(state) => [
        {
          opacity: state.pressed ? activeOpacity : undefined,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};
