import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Typography, useTheme } from "react-native-orchard";

export default function NotFoundScreen() {
  const { spacing, colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xl,
        }}
      >
        <Typography variant="largeTitleEmphasized">
          This screen doesn't exist.
        </Typography>
        <Link href="/" asChild>
          <Typography
            style={{
              marginTop: spacing.xl,
              paddingVertical: spacing.xl,
              color: colors.blue,
            }}
          >
            Go to home screen!
          </Typography>
        </Link>
      </View>
    </>
  );
}
