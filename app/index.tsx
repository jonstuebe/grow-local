import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";

export default function Home() {
  const {
    theme: { spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, position: "relative" }}
      >
        <GrowTotal />
        <GrowItems />
      </SafeAreaView>
      <Link
        href="/new"
        asChild
        style={{
          position: "absolute",
          top: insets.top + (spacing?.sm ?? 0),
          right: insets.right + (spacing?.sm ?? 0),
        }}
      >
        <Pressable
          hitSlop={12}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : undefined,
          })}
        >
          <Icon
            fontFamily="Ionicons"
            name="add-outline"
            fontSize="5xl"
            color={iOSColors.blue}
          />
        </Pressable>
      </Link>
    </>
  );
}
