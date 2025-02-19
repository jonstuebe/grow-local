import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import { BlurView } from "expo-blur";
import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";

export default function Home() {
  const {
    theme: { colors, spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, position: "relative" }}
    >
      <GrowTotal />
      <Div
        flex={1}
        rounded="2xl"
        overflow="hidden"
        bg="gray900"
        position="relative"
      >
        <GrowItems />
        <BlurView
          intensity={80}
          tint="dark"
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: spacing?.lg,
            paddingBottom: insets.bottom === 0 ? spacing?.lg : insets.bottom,
            paddingHorizontal: spacing?.xl,
            alignItems: "center",
          }}
        >
          <Link href="/settings" asChild>
            <Pressable
              hitSlop={12}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : undefined,
              })}
            >
              <Icon
                fontFamily="Ionicons"
                name="settings-outline"
                fontSize="3xl"
                color={iOSColors.blue}
              />
            </Pressable>
          </Link>
          <Link
            href="/new"
            onPress={async () => {
              await Haptics.impactAsync();
            }}
            asChild
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
        </BlurView>
      </Div>
    </SafeAreaView>
  );
}
