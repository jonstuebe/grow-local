import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { toastConfig } from "../components/CustomToast";

import "react-native-gesture-handler";
import "react-native-reanimated";

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
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="transfer"
              options={{
                title: "Transfer",
                sheetAllowedDetents: [0.3, 1],
              }}
            />
            <Stack.Screen
              name="[id]/edit"
              options={{
                title: "Edit",
                presentation: "modal",
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
                sheetAllowedDetents: [0.3, 1],
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
