import { MenuView } from "@react-native-menu/menu";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { observer } from "mobx-react-lite";
import { ActionSheetIOS, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";
import { PressableOpacity } from "../components/PressableOpacity";
import { rootStore } from "../state";
import { theme } from "../theme";
import { getSnapshot } from "mobx-state-tree";
import { backupData } from "../data";

function Home() {
  const router = useRouter();
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
                  imageColor: theme.colors.red,
                  attributes: {
                    destructive: true,
                    disabled: rootStore.items.size === 0,
                  },
                },
                {
                  id: "backups",
                  title: "Backups",
                  image: "arrow.down.to.line",
                  imageColor: theme.colors.white,
                  attributes: {
                    disabled: rootStore.items.size === 0,
                  },
                },
              ]}
              onPressAction={({ nativeEvent: { event: id } }) => {
                switch (id) {
                  case "delete":
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        title: "Are you sure?",
                        message: "This action cannot be undone.",
                        options: ["Cancel", "Delete All"],
                        destructiveButtonIndex: 1,
                        cancelButtonIndex: 0,
                      },
                      (buttonIndex) => {
                        if (buttonIndex === 1) {
                          rootStore.removeItems();
                        }
                      }
                    );
                    break;
                  case "backups":
                    router.push("/backups");
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
