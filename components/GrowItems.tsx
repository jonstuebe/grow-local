import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native-gesture-handler";
import { Div, Skeleton, Text, useTheme } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { rootStore } from "../state";
import { GrowItem } from "./GrowItem";

export const GrowItems = observer(() => {
  const {
    theme: { spacing, borderRadius, colors },
  } = useTheme();
  const insets = useSafeAreaInsets();

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
            <Text
              fontWeight="bold"
              fontSize="4xl"
              color="white"
              textAlign="center"
              mb="xs"
            >
              No Goals Added
            </Text>
            <Text
              fontWeight="500"
              fontSize="lg"
              color="gray200"
              textAlign="center"
            >
              Add to Get Started
            </Text>
          </Div>
        );
      }

      return (
        <ScrollView
          style={{
            backgroundColor: colors?.gray900,
            borderRadius: borderRadius ? borderRadius["2xl"] : undefined,
          }}
          contentContainerStyle={{
            paddingTop: spacing?.lg,
            paddingBottom: (spacing?.lg ?? 0) + insets.bottom,
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
