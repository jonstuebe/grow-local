import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { toastConfig } from "../components/CustomToast";

import "react-native-gesture-handler";
import "react-native-reanimated";
import { Text, View } from "react-native";

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
              sheetCornerRadius: 10,
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
                headerShown: false,
                sheetAllowedDetents: [0.35, 1],
              }}
            />
            <Stack.Screen
              name="[id]/edit"
              options={{
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="[id]/add"
              options={{
                headerShown: false,
                sheetAllowedDetents: [0.2],
              }}
            />
            <Stack.Screen
              name="[id]/remove"
              options={{
                headerShown: false,
                sheetAllowedDetents: [0.2],
              }}
            />
            <Stack.Screen
              name="[id]/transactions"
              options={{
                headerShown: false,
                sheetAllowedDetents: [0.3, 0.5],
                sheetExpandsWhenScrolledToEdge: false,
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
