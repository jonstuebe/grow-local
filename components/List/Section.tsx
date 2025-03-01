import { Children, cloneElement, ReactNode } from "react";

import { Text, type StyleProp, type ViewStyle } from "react-native";
import { View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { theme } from "../../theme";

export interface SectionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function SectionContainer({ children, style }: SectionProps) {
  return <View style={[{}, style]}>{children}</View>;
}

interface SectionHeaderProps {
  children: ReactNode;
}

function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <Text
      style={[
        iOSUIKit.body,
        {
          fontSize: 13,
          lineHeight: 16,
          textTransform: "uppercase",
          color: theme.colors.labels.secondary,
          marginBottom: 7,
          marginLeft: 16,
        },
      ]}
    >
      {children}
    </Text>
  );
}

interface SectionContentProps {
  children: ReactNode;
  rounded?: boolean;
}

function SectionContent({ children, rounded = true }: SectionContentProps) {
  const filteredChildren = Children.toArray(children).filter(
    (child): child is JSX.Element => child !== null
  );

  return (
    <View
      style={{
        borderRadius: rounded ? theme.borderRadius.rowContainer : undefined,
        overflow: "hidden",
      }}
    >
      {Children.map(filteredChildren, (child, index) => {
        return cloneElement(child, {
          rounded: false,
          style: [
            index === filteredChildren.length - 1
              ? undefined
              : {
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.colors.separators.nonOpaque,
                },
          ],
        });
      })}
    </View>
  );
}

interface SectionFooterProps {
  children: string;
}

function SectionFooter({ children }: SectionFooterProps) {
  return (
    <Text
      style={[
        iOSUIKit.body,
        {
          color: theme.colors.labels.secondary,
          fontSize: 13,
          lineHeight: 16,
          marginTop: 5,
          marginLeft: 16,
        },
      ]}
    >
      {children}
    </Text>
  );
}

const Section = {
  Container: SectionContainer,
  Header: SectionHeader,
  Footer: SectionFooter,
  Content: SectionContent,
};

export default Section;
