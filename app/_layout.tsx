import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
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
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <MagnusThemeProvider theme={theme}>
          <Stack
            screenOptions={{
              presentation: "modal",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="new" options={{ title: "Add New Goal" }} />
            {/* <Stack.Screen
              name="add"
              options={{ title: "Add", presentation: "modal" }}
            /> */}
            {/* <Stack.Screen
              name="remove"
              options={{ title: "Remove", presentation: "modal" }}
            /> */}
          </Stack>
        </MagnusThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
