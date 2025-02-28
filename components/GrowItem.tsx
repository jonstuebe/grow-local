import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { type ItemType } from "../types";
import { formatCurrency } from "../utils";

export function GrowItem({ item }: { item: ItemType }) {
  const {
    theme: { spacing, colors, borderRadius },
  } = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing?.md,
      }}
    >
      <Link href={{ pathname: "/[id]/edit", params: { id: item.id } }} asChild>
        <Pressable style={{ flex: 1, position: "relative" }}>
          <View
            style={{
              backgroundColor: colors?.gray600,
              borderRadius: borderRadius?.xl,
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              overflow: "hidden",
              width: "100%",
              height: 56,
              gap: 2,
            }}
          >
            {item.percentSaved ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: colors?.gray500,
                  width:
                    item.percentSaved >= 1
                      ? "100%"
                      : `${item.percentSaved * 100}%`,
                  height: 56,
                }}
              />
            ) : null}
            <View style={{ padding: spacing?.lg, gap: spacing?.xxs }}>
              <Text
                color="white"
                fontSize="xl"
                fontWeight="500"
                allowFontScaling={false}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                color="gray100"
                fontSize="md"
                fontWeight="500"
                allowFontScaling={false}
              >
                {item.goalAmount
                  ? `${formatCurrency(item.curAmount)} of ${formatCurrency(
                      item.goalAmount
                    )}`
                  : formatCurrency(item.curAmount)}
              </Text>
            </View>
            {item.percentSaved ? (
              <Text
                color={item.percentSaved >= 1 ? "white" : "gray200"}
                fontSize="lg"
                pr="md"
              >{`${Math.round(item.percentSaved * 100)}%`}</Text>
            ) : null}
          </View>
        </Pressable>
      </Link>
      <View
        style={{ alignItems: "center", flexDirection: "row", gap: spacing?.md }}
      >
        <Button
          p="lg"
          bg="gray700"
          color="white"
          underlayColor="gray600"
          rounded="xl"
          w={56}
          h={56}
          onPress={async () => {
            router.push({ pathname: "/[id]/remove", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <Icon
            name="remove-outline"
            fontFamily="Ionicons"
            color={iOSColors.red}
            fontSize="4xl"
          />
        </Button>
        <Button
          p="lg"
          bg="gray700"
          color="white"
          underlayColor="gray600"
          rounded="xl"
          w={60}
          h={56}
          onPress={async () => {
            router.push({ pathname: "/[id]/add", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <Icon
            name="add-outline"
            fontFamily="Ionicons"
            color={iOSColors.blue}
            fontSize="4xl"
          />
        </Button>
      </View>
    </View>
  );
}
