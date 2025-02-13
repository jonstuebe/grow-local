import { Link, Stack } from "expo-router";
import { Div, Text } from "react-native-magnus";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Div flex={1} alignItems="center" justifyContent="center" p={20}>
        <Text fontSize={20} fontWeight="bold">
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Text mt={15} py={15} fontSize={14} color="blue">
            Go to home screen!
          </Text>
        </Link>
      </Div>
    </>
  );
}
