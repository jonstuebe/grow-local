import { SymbolView } from "expo-symbols";
import { Text as RNText, TextProps, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useRouter } from "expo-router";
import { Children, ReactNode } from "react";
import { theme } from "../theme";
import { rgbaToHex } from "../utils";
import { PressableOpacity } from "./PressableOpacity";

function Container({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        paddingTop: 14,
        paddingBottom: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent:
          Children.count(children) === 1 ? "flex-end" : "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 1)",
      }}
    >
      {children}
    </View>
  );
}

function Text({ children, style, ...props }: TextProps) {
  return (
    <RNText
      style={[
        iOSUIKit.title3,
        { color: theme.colors.white, fontWeight: "600" },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

function CloseButton() {
  const router = useRouter();

  return (
    <PressableOpacity
      onPress={() => {
        if (router.canDismiss()) {
          router.dismiss();
        }
      }}
    >
      <SymbolView
        name="xmark.circle.fill"
        size={30}
        tintColor={rgbaToHex(theme.colors.fills.vibrantPrimary)}
      />
    </PressableOpacity>
  );
}

export const SheetHeader = {
  Container,
  Text,
  CloseButton,
};
