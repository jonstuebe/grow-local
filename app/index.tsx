import { Link } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Pressable, ScrollView } from "react-native";
import { Div, Icon, Skeleton, Text, useTheme } from "react-native-magnus";
import * as Clipboard from "expo-clipboard";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import { GrowItem } from "../components/GrowItem";
import { rootStore } from "../state";

const GrowItems = observer(({}: {}) => {
  useEffect(() => {
    rootStore.getItems();
  }, []);

  switch (rootStore.status) {
    case "loading":
      return new Array(3)
        .fill("")
        .map((_, idx) => (
          <Skeleton.Box key={idx} w="100%" h={40} bg="gray700" />
        ));
    case "success":
      return rootStore.items.map((item, idx) => {
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
      });

    default:
      return null;
  }
});

const Total = observer(() => {
  return (
    <Pressable
      onPress={async () => {
        await Clipboard.setStringAsync(String(rootStore.itemsTotal));
      }}
    >
      {({ pressed }) => (
        <Text
          fontSize="6xl"
          fontWeight="bold"
          color={pressed ? "gray100" : "white"}
          textAlign="center"
        >
          {rootStore.itemsTotalFormatted}
        </Text>
      )}
    </Pressable>
  );
});

export default function Home() {
  const {
    theme: { borderRadius, colors, spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, position: "relative" }}
      >
        <Div py="2xl">
          <Total />
        </Div>
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
          <GrowItems />
        </ScrollView>
      </SafeAreaView>
      <Link
        href="/new"
        asChild
        style={{
          position: "absolute",
          top: insets.top + (spacing?.sm ?? 0),
          right: insets.right + (spacing?.sm ?? 0),
        }}
      >
        <Pressable
          hitSlop={12}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : undefined,
          })}
        >
          <Icon
            fontFamily="Ionicons"
            name="add-outline"
            fontSize="5xl"
            color={iOSColors.blue}
          />
        </Pressable>
      </Link>
    </>
  );
}
