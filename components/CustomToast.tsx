import { SymbolView } from "expo-symbols";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { iOSUIKit } from "react-native-typography";

import { theme } from "../theme";
import { BlurView } from "expo-blur";
import { Pressable, Text, View } from "react-native";

export interface CustomToastProps extends BaseToastProps {
  type: "success" | "error";
}

export const toastConfig = {
  success: (props: any) => {
    return <CustomToast {...props} type="success" />;
  },
  error: (props: any) => <CustomToast {...props} type="error" />,
};

export function CustomToast({ type, onPress, ...props }: CustomToastProps) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
        }
        Toast.hide();
      }}
    >
      <BlurView
        tint="dark"
        intensity={10}
        style={[
          {
            borderRadius: theme.borderRadius["2xl"],
            overflow: "hidden",
          },
          theme.shadow.lg,
        ]}
      >
        <View
          style={{
            backgroundColor: `${theme.colors.gray600}80`,
            borderRadius: theme.borderRadius["2xl"],
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.lg,
            gap: theme.spacing.md,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {type === "success" ? (
            <SymbolView
              name="checkmark.circle"
              tintColor={theme.colors.green}
            />
          ) : (
            <SymbolView
              name="exclamationmark.circle"
              tintColor={theme.colors.red}
            />
          )}
          <Text
            style={[
              iOSUIKit.callout,
              {
                color: theme.colors.white,
                fontWeight: "500",
                letterSpacing: -0.1,
                paddingRight: theme.spacing.xs,
              },
            ]}
          >
            {props.text1}
          </Text>
        </View>
      </BlurView>
    </Pressable>
  );
}
