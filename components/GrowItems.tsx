import { ScrollView } from "react-native-gesture-handler";
import { Button, Div, Skeleton, Text, useTheme } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { GrowItem } from "./GrowItem";
import { getItemsList } from "../queries/item/list";
import { ItemSchema } from "../schemas/item";
import { useReactiveQuery } from "../hooks/useReactiveQuery";

export function GrowItems() {
  const {
    theme: { spacing, colors },
  } = useTheme();
  const { status, data } = useReactiveQuery<ItemSchema>(getItemsList);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  switch (status) {
    case "loading":
      return new Array(3)
        .fill("")
        .map((_, idx) => (
          <Skeleton.Box key={idx} w="100%" h={40} bg="gray700" />
        ));
    case "error":
      return (
        <Div flex={1} alignItems="center" justifyContent="center">
          <Text color="white">Error</Text>
        </Div>
      );
    case "success":
      if (data.length === 0) {
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
          {data.map((item, idx) => {
            return (
              <GrowItem
                key={idx}
                item={{
                  id: item.id,
                  name: item.name,
                  cur_amount: item.cur_amount,
                  balance: item.balance,
                  goal_amount: item.goal_amount,
                  goal: item.goal,
                  created_at: item.created_at,
                  updated_at: item.updated_at,
                }}
              />
            );
          })}
        </ScrollView>
      );

    default:
      return null;
  }
}
