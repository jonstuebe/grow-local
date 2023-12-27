import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ThemeProvider as MagnusThemeProvider } from "react-native-magnus";
import { SafeAreaProvider } from "react-native-safe-area-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/new` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

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

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ThemeProvider value={DarkTheme}>
        <MagnusThemeProvider theme={theme}>
          <Stack
            screenOptions={{
              presentation: "modal",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="new" options={{ title: "Add New Goal" }} />
          </Stack>
        </MagnusThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
