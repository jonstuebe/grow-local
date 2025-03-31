import * as Clipboard from "expo-clipboard";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "react-native-orchard";

import { rootStore } from "../state";
import { formatCurrency } from "../utils";

export const GrowTotal = observer(() => {
  const { colors, spacing, typography } = useTheme();
  const numItems = computed(() => rootStore.itemsArray.length).get();
  const itemsTotal = computed(() => rootStore.itemsTotal).get();
  const itemsTotalFormatted = useMemo(
    () => formatCurrency(itemsTotal),
    [itemsTotal]
  );

  if (numItems === 0) return null;

  return (
    <View style={{ paddingVertical: spacing.xl }}>
      <Pressable
        onPress={async () => {
          await Clipboard.setStringAsync(String(itemsTotal));
          await Haptics.selectionAsync();
        }}
      >
        {({ pressed }) => (
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: pressed ? colors.gray : colors.textPrimaryInverted,
              fontSize: typography.largeTitleRegular.fontSize,
            }}
          >
            {itemsTotalFormatted}
          </Text>
        )}
      </Pressable>
    </View>
  );
});
