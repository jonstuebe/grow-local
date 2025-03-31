import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { PressableOpacity, Typography, useTheme } from "react-native-orchard";

import { type ItemType } from "../types";
import { formatCurrency } from "../utils";

export function GrowItem({ item }: { item: ItemType }) {
  const router = useRouter();
  const { colors, radius, spacing, typography } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.md,
      }}
    >
      <Link
        href={{
          pathname: "/[id]/edit",
          params: {
            id: item.id,
            name: item.name,
            curAmount: String(item.curAmount),
            goalAmount: item.goalAmount ? String(item.goalAmount) : undefined,
            goal: String(item.goalAmount ? true : false),
          },
        }}
        asChild
      >
        <Pressable style={{ flex: 1, position: "relative" }}>
          {({ pressed }) => (
            <View
              style={{
                backgroundColor: pressed ? colors.gray4 : colors.gray5,
                borderRadius: radius.xl,
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
                    backgroundColor: colors.gray4,
                    width:
                      item.percentSaved >= 1
                        ? "100%"
                        : `${item.percentSaved * 100}%`,
                    height: 56,
                  }}
                />
              ) : null}
              <View style={{ padding: spacing.lg, gap: spacing.xxs }}>
                <Typography
                  variant="headlineRegular"
                  color="textPrimaryInverted"
                  allowFontScaling={false}
                  numberOfLines={1}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="calloutRegular"
                  color="labelVibrantSecondary"
                  allowFontScaling={false}
                >
                  {item.goalAmount
                    ? `${formatCurrency(item.curAmount)} of ${formatCurrency(
                        item.goalAmount
                      )}`
                    : formatCurrency(item.curAmount)}
                </Typography>
              </View>
              {item.percentSaved ? (
                <Typography
                  variant="calloutRegular"
                  color={
                    item.percentSaved >= 1
                      ? "textPrimaryInverted"
                      : "labelVibrantSecondary"
                  }
                  style={{
                    paddingRight: spacing.md,
                  }}
                >{`${Math.round(item.percentSaved * 100)}%`}</Typography>
              ) : null}
            </View>
          )}
        </Pressable>
      </Link>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.md,
        }}
      >
        <PressableOpacity
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            padding: spacing.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? colors.gray4 : colors.gray5,
            borderRadius: radius.xl,
          })}
          onPress={async () => {
            router.push({ pathname: "/[id]/remove", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <SymbolView name="minus" tintColor={colors.red} size={20} />
        </PressableOpacity>
        <PressableOpacity
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            padding: spacing.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? colors.gray4 : colors.gray5,
            borderRadius: radius.xl,
          })}
          onPress={async () => {
            router.push({ pathname: "/[id]/add", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <SymbolView name="plus" tintColor={colors.blue} size={20} />
        </PressableOpacity>
      </View>
    </View>
  );
}
