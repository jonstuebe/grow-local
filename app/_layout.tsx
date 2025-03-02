import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { BaseToast } from "react-native-toast-message";

import "react-native-reanimated";
import "react-native-gesture-handler";
import { iOSUIKit } from "react-native-typography";
import { theme } from "../theme";
import { SymbolView } from "expo-symbols";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        height: "auto",
        borderLeftColor: "transparent",
        borderWidth: 0,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.gray500,
        padding: theme.spacing.md,
        ...theme.shadow.md,
        gap: theme.spacing.md,
      }}
      renderLeadingIcon={() => (
        <SymbolView name="checkmark.circle" tintColor={theme.colors.green} />
      )}
      contentContainerStyle={{
        paddingVertical: 0,
        paddingHorizontal: 0,
      }}
      text1Style={{
        ...iOSUIKit.bodyEmphasizedWhiteObject,
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        height: "auto",
        borderLeftColor: "transparent",
        borderWidth: 0,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.gray500,
        padding: theme.spacing.md,
        ...theme.shadow.md,
        gap: theme.spacing.md,
      }}
      renderLeadingIcon={() => (
        <SymbolView
          name="exclamationmark.circle"
          tintColor={theme.colors.red}
        />
      )}
      contentContainerStyle={{
        paddingVertical: 0,
        paddingHorizontal: 0,
      }}
      text1Style={{
        ...iOSUIKit.bodyEmphasizedWhiteObject,
        color: theme.colors.red,
      }}
    />
  ),
};

export default function RootLayout() {
  return (
    <>
      <GestureHandlerRootView>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              presentation: "formSheet",
              animation: "slide_from_bottom",
              gestureDirection: "vertical",
              sheetAllowedDetents: [0.5, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="new"
              options={{
                title: "Add Item",
                sheetAllowedDetents: [0.4, 1],
              }}
            />
            <Stack.Screen
              name="transfer"
              options={{
                title: "Transfer",
              }}
            />
            <Stack.Screen
              name="[id]/edit"
              options={{
                title: "Edit",
                sheetAllowedDetents: [0.45, 1],
              }}
            />
            <Stack.Screen
              name="[id]/add"
              options={{
                title: "Deposit",
                sheetAllowedDetents: [0.2, 1],
              }}
            />
            <Stack.Screen
              name="[id]/remove"
              options={{
                title: "Withdrawal",
                sheetAllowedDetents: [0.2, 1],
              }}
            />
            <Stack.Screen
              name="[id]/transactions"
              options={{
                title: "Transactions",
                sheetAllowedDetents: [0.3, 0.5, 1],
              }}
            />
            <Stack.Screen
              name="backups"
              options={{
                title: "Backups",
                presentation: "modal",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </>
  );
}
