import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Div, Skeleton, Text, useTheme } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { rootStore } from "../state";
import { GrowItem } from "./GrowItem";

export const GrowItems = observer(() => {
  const {
    theme: { spacing, colors },
  } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  switch (rootStore.status) {
    case "loading":
      return new Array(3)
        .fill("")
        .map((_, idx) => (
          <Skeleton.Box key={idx} w="100%" h={40} bg="gray700" />
        ));
    case "success":
      if (rootStore.items.size === 0) {
        return (
          <Div flex={1} alignItems="center" justifyContent="center">
            <Div>
              <Text
                fontWeight="bold"
                fontSize="6xl"
                color="white"
                textAlign="center"
                mb="xs"
              >
                No Goals Added
              </Text>
              <Text
                fontWeight="500"
                fontSize="xl"
                color="gray200"
                textAlign="center"
              >
                Add to Get Started
              </Text>
            </Div>
            <Div>
              <Button
                bg={iOSColors.blue}
                mt="xl"
                rounded="lg"
                fontSize="2xl"
                px="3xl"
                onPress={async () => {
                  router.push("/new");
                  await Haptics.impactAsync();
                }}
              >
                Add Goal
              </Button>
            </Div>
          </Div>
        );
      }

      return (
        <ScrollView
          style={{
            backgroundColor: colors?.gray900,
          }}
          contentContainerStyle={{
            paddingTop: spacing?.lg,
            // 28 is the icon height (I'm guessing)
            paddingBottom:
              (spacing?.lg ?? 0) + (insets.bottom + (spacing?.lg ?? 0) + 28),
            paddingHorizontal: spacing?.lg,
            gap: spacing?.lg,
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
