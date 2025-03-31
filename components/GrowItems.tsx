import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Typography, useTheme } from "react-native-orchard";

import { rootStore } from "../state";
import { GrowItem } from "./GrowItem";

export const GrowItems = observer(() => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, radius, spacing, typography } = useTheme();

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
              <Typography
                variant="largeTitleEmphasized"
                style={{
                  color: colors.textPrimaryInverted,
                  textAlign: "center",
                  marginBottom: spacing.xs,
                }}
              >
                No Goals Added
              </Typography>
              <Typography
                variant="title2Regular"
                style={{
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
              >
                Add to Get Started
              </Typography>
            </View>
            <View>
              <Button
                style={{
                  backgroundColor: colors.blue,
                  marginTop: spacing.xl,
                  borderRadius: radius.lg,
                  paddingHorizontal: spacing.xxxl,
                }}
                textStyle={{
                  fontSize: typography.title2Regular.fontSize,
                  color: colors.white,
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
            backgroundColor: colors.materialChrome,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            // 28 is the icon height (I'm guessing)
            paddingBottom:
              (spacing.lg ?? 0) + (insets.bottom + (spacing.lg ?? 0) + 28),
            paddingHorizontal: spacing.lg,
            gap: spacing.lg,
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
