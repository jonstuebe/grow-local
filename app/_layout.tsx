import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider as MagnusThemeProvider } from "react-native-magnus";

import "react-native-reanimated";
import "expo-dev-client";

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
              presentation: "modal",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="new" options={{ title: "Add Item" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </MagnusThemeProvider>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
