import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider as MagnusThemeProvider } from "react-native-magnus";

import "react-native-reanimated";

const theme = {
  colors: {
    gray100: "rgb(156, 156, 161)",
    gray200: "rgb(142, 142, 147)",
    gray300: "rgb(99, 99, 102)",
    gray400: "rgb(72, 72, 74)",
    gray500: "rgb(58, 58, 60)",
    gray600: "rgb(44, 44, 46)",
    gray700: "rgb(28, 28, 30)",
    gray800: "rgb(25, 25, 27)",
    gray900: "rgb(22, 22, 24)",
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DarkTheme}>
        <MagnusThemeProvider theme={theme}>
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
              name="transfers"
              options={{
                title: "Transfers",
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
            <Stack.Screen name="+not-found" />
          </Stack>
        </MagnusThemeProvider>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
