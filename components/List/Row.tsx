import { MenuComponentProps, MenuView } from "@react-native-menu/menu";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import { ReactNode, useMemo } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import Swipeable, {
  SwipeableProps,
} from "react-native-gesture-handler/ReanimatedSwipeable";

import { theme } from "../../theme";
import { rgbaToHex } from "../../utils";
import { PressableOpacity, PressableOpacityProps } from "../PressableOpacity";

interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
}

const containerStyles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.rowContainer,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
});

function Container({ children, style, rounded = true }: ContainerProps) {
  return (
    <View
      style={[
        containerStyles.root,
        {
          borderRadius: rounded ? theme.borderRadius.rowContainer : undefined,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface SwipeableContainerProps
  extends Omit<ContainerProps, "children">,
    SwipeableProps {}

function SwipeableContainer({
  children,
  style,
  rounded = true,
  ...props
}: SwipeableContainerProps) {
  return (
    <Swipeable {...props}>
      <Container style={style} rounded={rounded}>
        {children}
      </Container>
    </Swipeable>
  );
}

interface PressableContainerProps
  extends Omit<ContainerProps, "children" | "style">,
    PressableOpacityProps {}

function PressableContainer({
  children,
  rounded = true,
  style,
  ...props
}: PressableContainerProps) {
  return (
    <PressableOpacity
      style={(state) => [
        containerStyles.root,
        {
          borderRadius: rounded ? theme.borderRadius.rowContainer : undefined,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
    </PressableOpacity>
  );
}

interface LabelProps extends TextProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "quaternary";
  variant?: "title" | "subtitle";
}

function Label({
  children,
  style,
  variant = "title",
  color = "primary",
  ...props
}: LabelProps) {
  return (
    <Text
      style={[
        iOSUIKit.body,
        {
          color: theme.colors.labels[color],
        },
        theme.text.rowLabel[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

interface ContentProps extends ViewProps {
  children: ReactNode;
}

function Content({ children, style, ...props }: ContentProps) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

interface TrailingProps extends ViewProps {
  children: ReactNode;
}

function Trailing({ children, style, ...props }: TrailingProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
          flex: 2 / 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

interface AccessoryIconProps extends Omit<SymbolViewProps, "tintColor"> {
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "blue"
    | (string & {});
}

function AccessoryIcon({
  name,
  color,
  style,
  size = 20,
  type = "monochrome",
  ...props
}: AccessoryIconProps) {
  const tintColor = useMemo(() => {
    switch (color) {
      case "primary":
        return rgbaToHex(theme.colors.labels.primary);
      case "secondary":
        return rgbaToHex(theme.colors.labels.secondary);
      case "tertiary":
        return rgbaToHex(theme.colors.labels.tertiary);
      case "quaternary":
        return rgbaToHex(theme.colors.labels.quaternary);
      case "blue":
        return theme.colors.blue;
      default:
        return color;
    }
  }, [color]);

  return (
    <SymbolView
      name={name}
      style={style}
      size={size}
      tintColor={tintColor}
      type={type}
      {...props}
    />
  );
}

function AccessoryDisclosureIndicator() {
  return <AccessoryIcon name="chevron.right" size={16} color="secondary" />;
}

interface AccessoryLabelProps extends LabelProps {}

function AccessoryLabel({ children, ...props }: AccessoryLabelProps) {
  return (
    <Label color="secondary" {...props}>
      {children}
    </Label>
  );
}

interface TrailingMenuProps extends MenuComponentProps {
  children: ReactNode;
  disabled?: boolean;
}

function TrailingMenu({ children, disabled, ...props }: TrailingMenuProps) {
  if (disabled) {
    return (
      <PressableOpacity
        activeOpacity={disabled ? 0.5 : 0.8}
        disabled={disabled}
      >
        <Trailing>{children}</Trailing>
      </PressableOpacity>
    );
  }

  return (
    <PressableOpacity>
      <MenuView {...props}>
        <Trailing>{children}</Trailing>
      </MenuView>
    </PressableOpacity>
  );
}

export interface TextInputProps extends RNTextInputProps {
  onReset?: () => void;
}

function TextInput({
  children,
  value,
  onReset,
  style,
  ...props
}: TextInputProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
      }}
    >
      <RNTextInput
        value={value}
        style={[
          {
            color: theme.colors.labels.primary,
            flex: 1,
            textAlign: "right",
          },
          style,
        ]}
        {...props}
      />
      {value && onReset && (
        <PressableOpacity hitSlop={4} onPress={onReset}>
          <AccessoryIcon name="xmark.circle.fill" size={16} color="secondary" />
        </PressableOpacity>
      )}
    </View>
  );
}

const Row = {
  Container: Container,
  PressableContainer: PressableContainer,
  SwipeableContainer: SwipeableContainer,
  Label: Label,
  Content: Content,
  Trailing: Trailing,
  TrailingMenu,
  AccessoryIcon,
  AccessoryLabel,
  DisclosureIndicator: AccessoryDisclosureIndicator,
  TextInput: TextInput,
};

export default Row;
