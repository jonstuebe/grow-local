import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Button, Div, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { type ItemType } from "../types";
import { formatCurrency } from "../utils";
import { useLayout } from "../hooks/onLayout";

export function GrowItem({ item }: { item: ItemType }) {
  const {
    theme: { spacing },
  } = useTheme();
  const router = useRouter();
  const { width, onLayout } = useLayout();

  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ gap: spacing?.md }}
    >
      <Link href={{ pathname: "/[id]/edit", params: { id: item.id } }} asChild>
        <Pressable style={{ flex: 1, position: "relative" }}>
          <Div
            bg="gray700"
            p="lg"
            rounded="xl"
            flex={1}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            overflow="hidden"
            h={56}
            style={{
              gap: 2,
            }}
            onLayout={onLayout}
          >
            {item.percentSaved ? (
              <Div
                position="absolute"
                top={0}
                left={0}
                bg="gray600"
                w={item.percentSaved > 1 ? width : width * item.percentSaved}
                h={56}
              />
            ) : null}
            <Div>
              <Text
                color="gray100"
                fontSize="lg"
                fontWeight="500"
                allowFontScaling={false}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                color="gray300"
                fontSize="sm"
                fontWeight="500"
                allowFontScaling={false}
              >
                {item.goalAmount
                  ? `${formatCurrency(item.curAmount)} of ${formatCurrency(
                      item.goalAmount
                    )}`
                  : formatCurrency(item.curAmount)}
              </Text>
            </Div>
          </Div>
        </Pressable>
      </Link>
      <Div alignItems="center" flexDir="row" style={{ gap: spacing?.md }}>
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
      </Div>
    </Div>
  );
}
