import { useNavigation } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import { PressableOpacity } from "../components/PressableOpacity";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { theme } from "../theme";

export type HeaderAction = {
  label: string;
  disabled?: boolean;
  color?: string;
  onPress: () => void;
};

export function useScreenHeader({
  title,
  headerLeftActions,
  headerRightActions,
}: {
  title?: string;
  headerLeftActions?: HeaderAction[];
  headerRightActions?: HeaderAction[];
}) {
  const navigation = useNavigation();
  const options = useMemo(() => {
    const options: Record<string, any> = {};

    if (title) {
      options.title = title;
    }

    if (headerLeftActions) {
      options.headerLeft = () => (
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {headerLeftActions?.map(
            ({ label, onPress, disabled, color }, idx) => (
              <PressableOpacity onPress={onPress} key={idx} disabled={disabled}>
                <Text
                  style={[
                    iOSUIKit.body,
                    {
                      fontWeight: "500",
                      color: color ?? theme.colors.blue,
                    },
                  ]}
                >
                  {label}
                </Text>
              </PressableOpacity>
            )
          )}
        </View>
      );
    }

    if (headerRightActions) {
      options.headerRight = () => (
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {headerRightActions?.map(
            ({ label, onPress, disabled, color }, idx) => (
              <PressableOpacity onPress={onPress} key={idx} disabled={disabled}>
                <Text
                  style={[
                    iOSUIKit.body,
                    {
                      color: color ?? theme.colors.blue,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {label}
                </Text>
              </PressableOpacity>
            )
          )}
        </View>
      );
    }

    return options;
  }, [title, headerLeftActions, headerRightActions]);

  useLayoutEffect(() => {
    navigation.setOptions(options);
  }, [navigation, options]);
}
