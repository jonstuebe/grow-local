import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ConfirmMenu } from "../components/ConfirmMenu";
import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";
import { rootStore } from "../state";
import { theme } from "../theme";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, position: "relative" }}
    >
      <GrowTotal />
      <View
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: theme.colors.gray900,
          position: "relative",
        }}
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
            paddingTop: theme.spacing.lg,
            paddingBottom:
              insets.bottom === 0 ? theme.spacing.lg : insets.bottom,
            paddingHorizontal: theme.spacing.xl,
            alignItems: "center",
          }}
        >
          <ConfirmMenu
            onConfirm={() => {
              rootStore.removeItems();
            }}
            confirmTitle="Delete All"
            confirmDestructive
          >
            <SymbolView name="trash" tintColor={theme.colors.red} size={24} />
          </ConfirmMenu>
          <Link href="/transfer">
            <SymbolView
              name="arrow.up.arrow.down"
              tintColor={theme.colors.blue}
              size={24}
            />
          </Link>
          <Link href="/new">
            <SymbolView name="plus" tintColor={theme.colors.blue} size={24} />
          </Link>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}
