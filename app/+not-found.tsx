import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { theme } from "../theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.xl,
        }}
      >
        <Text
          style={{
            fontSize: theme.fontSize["2xl"],
            fontWeight: "bold",
          }}
        >
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Text
            style={{
              marginTop: theme.spacing.xl,
              paddingVertical: theme.spacing.xl,
              fontSize: theme.fontSize.md,
              color: theme.colors.blue,
            }}
          >
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
