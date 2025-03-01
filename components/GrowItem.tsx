import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { type ItemType } from "../types";
import { formatCurrency } from "../utils";
import { theme } from "../theme";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "./PressableOpacity";

export function GrowItem({ item }: { item: ItemType }) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: theme.spacing.md,
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
                backgroundColor: pressed
                  ? theme.colors.gray500
                  : theme.colors.gray600,
                borderRadius: theme.borderRadius.xl,
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
                    backgroundColor: theme.colors.gray500,
                    width:
                      item.percentSaved >= 1
                        ? "100%"
                        : `${item.percentSaved * 100}%`,
                    height: 56,
                  }}
                />
              ) : null}
              <View
                style={{ padding: theme.spacing.lg, gap: theme.spacing.xxs }}
              >
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={{
                    color: theme.colors.white,
                    fontSize: theme.fontSize.xl,
                    fontWeight: "500",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: theme.colors.gray100,
                    fontSize: theme.fontSize.md,
                    fontWeight: "500",
                  }}
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
                  style={{
                    color:
                      item.percentSaved >= 1
                        ? theme.colors.white
                        : theme.colors.gray200,
                    fontSize: theme.fontSize.lg,
                    paddingRight: theme.spacing.md,
                  }}
                >{`${Math.round(item.percentSaved * 100)}%`}</Text>
              ) : null}
            </View>
          )}
        </Pressable>
      </Link>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: theme.spacing.md,
        }}
      >
        <PressableOpacity
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            padding: theme.spacing.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed
              ? theme.colors.gray400
              : theme.colors.gray600,
            borderRadius: theme.borderRadius.xl,
          })}
          onPress={async () => {
            router.push({ pathname: "/[id]/remove", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <SymbolView name="minus" tintColor={theme.colors.red} size={20} />
        </PressableOpacity>
        <PressableOpacity
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            padding: theme.spacing.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed
              ? theme.colors.gray400
              : theme.colors.gray600,
            borderRadius: theme.borderRadius.xl,
          })}
          onPress={async () => {
            router.push({ pathname: "/[id]/add", params: { id: item.id } });
            await Haptics.impactAsync();
          }}
        >
          <SymbolView name="plus" tintColor={theme.colors.blue} size={20} />
        </PressableOpacity>
      </View>
    </View>
  );
}
