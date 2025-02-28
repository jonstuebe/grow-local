import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text, useTheme } from "react-native-magnus";

export default function NotFoundScreen() {
  const {
    theme: { spacing },
  } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text fontSize={20} fontWeight="bold">
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Text mt={15} py={15} fontSize={14} color="blue">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
