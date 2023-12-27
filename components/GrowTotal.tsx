import * as Clipboard from "expo-clipboard";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Pressable } from "react-native";
import { Div, Text } from "react-native-magnus";
import * as Haptics from "expo-haptics";

import { rootStore } from "../state";
import { formatCurrency } from "../utils";

export const GrowTotal = observer(() => {
  const numItems = computed(() => rootStore.itemsArray.length).get();
  const itemsTotal = computed(() => rootStore.itemsTotal).get();
  const itemsTotalFormatted = useMemo(
    () => formatCurrency(itemsTotal),
    [itemsTotal]
  );

  if (numItems === 0) return null;

  return (
    <Div py="xl">
      <Pressable
        onPress={async () => {
          await Clipboard.setStringAsync(String(itemsTotal));
          await Haptics.selectionAsync();
        }}
      >
        {({ pressed }) => (
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color={pressed ? "gray100" : "white"}
            textAlign="center"
          >
            {itemsTotalFormatted}
          </Text>
        )}
      </Pressable>
    </Div>
  );
});
