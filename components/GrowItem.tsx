import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Button, Div, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { formatCurrency } from "../utils";
import { ItemSchema } from "../schemas/item";

export function GrowItem({ item }: { item: ItemSchema }) {
  const {
    theme: { spacing },
  } = useTheme();
  const router = useRouter();

  const percent_saved = item.goal_amount ? item.balance / item.goal_amount : 0;

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
            bg="gray600"
            rounded="xl"
            flex={1}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            overflow="hidden"
            w="100%"
            h={56}
            style={{
              gap: 2,
            }}
          >
            {percent_saved ? (
              <Div
                position="absolute"
                top={0}
                left={0}
                bg="gray500"
                w={percent_saved >= 1 ? "100%" : `${percent_saved * 100}%`}
                h={56}
              />
            ) : null}
            <Div p="lg" style={{ gap: spacing?.xxs }}>
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
                {item.goal_amount
                  ? `${formatCurrency(item.balance)} of ${formatCurrency(
                      item.goal_amount
                    )}`
                  : formatCurrency(item.balance)}
              </Text>
            </Div>
            {percent_saved ? (
              <Text
                color={percent_saved >= 1 ? "white" : "gray200"}
                fontSize="lg"
                pr="md"
              >{`${Math.round(percent_saved * 100)}%`}</Text>
            ) : null}
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
