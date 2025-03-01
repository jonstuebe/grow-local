import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { rootStore } from "../state";
import { theme } from "../theme";
import { Button } from "./Button";
import { GrowItem } from "./GrowItem";

export const GrowItems = observer(() => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  switch (rootStore.status) {
    case "loading":
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    case "success":
      if (rootStore.items.size === 0) {
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: theme.fontSize["6xl"],
                  color: theme.colors.white,
                  textAlign: "center",
                  marginBottom: theme.spacing.xs,
                }}
              >
                No Goals Added
              </Text>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: theme.fontSize.xl,
                  color: theme.colors.gray200,
                  textAlign: "center",
                }}
              >
                Add to Get Started
              </Text>
            </View>
            <View>
              <Button
                style={{
                  backgroundColor: theme.colors.blue,
                  marginTop: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  paddingHorizontal: theme.spacing["3xl"],
                }}
                textStyle={{
                  fontSize: theme.fontSize["2xl"],
                  color: theme.colors.white,
                }}
                onPress={async () => {
                  router.push("/new");
                  await Haptics.impactAsync();
                }}
              >
                Add Goal
              </Button>
            </View>
          </View>
        );
      }

      return (
        <ScrollView
          style={{
            backgroundColor: theme.colors.gray900,
          }}
          contentContainerStyle={{
            paddingTop: theme.spacing.lg,
            // 28 is the icon height (I'm guessing)
            paddingBottom:
              (theme.spacing.lg ?? 0) +
              (insets.bottom + (theme.spacing.lg ?? 0) + 28),
            paddingHorizontal: theme.spacing.lg,
            gap: theme.spacing.lg,
          }}
        >
          {rootStore.itemsArray.map(([_id, item], idx) => {
            return (
              <GrowItem
                key={idx}
                item={{
                  id: item.id,
                  name: item.name,
                  curAmount: item.curAmount,
                  goalAmount: item.goalAmount,
                  percentSaved: item.percentSaved,
                }}
              />
            );
          })}
        </ScrollView>
      );

    default:
      return null;
  }
});
