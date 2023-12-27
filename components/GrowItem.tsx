import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Button, Div, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { useLayout } from "../hooks/onLayout";
import { type ItemType } from "../types";
import { formatCurrency } from "../utils";

export function GrowItem({ item }: { item: ItemType }) {
  const {
    theme: { spacing },
  } = useTheme();
  const { width, height, onLayout } = useLayout();
  const router = useRouter();

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
            style={{
              gap: 2,
            }}
            onLayout={onLayout}
          >
            <Div
              position="absolute"
              top={0}
              left={0}
              bg="gray600"
              w={item.percentSaved > 1 ? width : width * item.percentSaved}
              h={height}
            />
            <Div maxW={130}>
              <Text color="gray100" fontSize="lg" fontWeight="500">
                {item.name}
              </Text>
              <Text color="gray200" fontSize="sm" fontWeight="500">
                {Math.round(item.percentSaved * 100)}%
              </Text>
            </Div>
            <Div>
              <Text color="gray200" fontSize="md" fontWeight="500">
                {formatCurrency(item.curAmount)} of{" "}
                {formatCurrency(item.goalAmount)}
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
