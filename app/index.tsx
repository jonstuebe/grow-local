import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { MenuView } from "@react-native-menu/menu";
import { observer } from "mobx-react-lite";
import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";
import { PressableOpacity } from "../components/PressableOpacity";
import { rootStore } from "../state";
import { theme } from "../theme";

function Home() {
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
          <PressableOpacity>
            <MenuView
              actions={[
                {
                  id: "delete",
                  title: "Delete All",
                  image: "trash",
                  attributes: {
                    destructive: true,
                  },
                },
              ]}
              onPressAction={({ nativeEvent: { event: id } }) => {
                switch (id) {
                  case "delete":
                    rootStore.removeItems();
                    break;
                }
              }}
            >
              <SymbolView
                name="ellipsis.circle"
                tintColor={theme.colors.blue}
                size={24}
              />
            </MenuView>
          </PressableOpacity>

          <View>
            {rootStore.items.size > 1 ? (
              <Link href="/transfer">
                <SymbolView
                  name="arrow.up.arrow.down"
                  tintColor={theme.colors.blue}
                  size={24}
                />
              </Link>
            ) : null}
          </View>
          <Link href="/new">
            <SymbolView name="plus" tintColor={theme.colors.blue} size={24} />
          </Link>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

export default observer(Home);
