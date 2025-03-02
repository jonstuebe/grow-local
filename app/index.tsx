import { MenuView } from "@react-native-menu/menu";
import { BlurView } from "expo-blur";
import * as DocumentPicker from "expo-document-picker";
import { Link, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { observer } from "mobx-react-lite";
import { ActionSheetIOS, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { File } from "expo-file-system/next";
import { GrowItems } from "../components/GrowItems";
import { GrowTotal } from "../components/GrowTotal";
import { PressableOpacity } from "../components/PressableOpacity";
import { rootStore } from "../state";
import { theme } from "../theme";
import { loadData } from "../data";

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
              onPressAction={async ({ nativeEvent: { event: id } }) => {
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
                  case "import":
                    const result = await DocumentPicker.getDocumentAsync({
                      type: "application/json",
                      copyToCacheDirectory: true,
                      multiple: false,
                    });

                    if (!result.canceled) {
                      const file = new File(result.assets[0].uri);
                      const data = loadData(file);
                      if (data) {
                        rootStore.restore(data);
                      }
                    }
                    break;
                  case "backups":
                    router.push("/backups");
                }
              }}
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
                  id: "import",
                  image: "arrow.down.to.line",
                  imageColor: theme.colors.white,
                  title: "Import",
                },
                {
                  id: "backups",
                  title: "Backups",
                  image: "iphone.app.switcher",
                  imageColor: theme.colors.white,
                },
              ]}
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
