import { useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useLayoutEffect } from "react";
import { ActionSheetIOS, Pressable } from "react-native";
import { Button, Div, Icon } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import { rootStore } from "../state";
const Settings = observer(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          hitSlop={4}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
        >
          <Icon
            name="close-outline"
            fontFamily="Ionicons"
            fontSize="4xl"
            color="gray300"
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <Div flex={1} position="relative">
      <Div
        position="absolute"
        bottom={insets.bottom}
        left={0}
        w="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Div flex={1}>
          <Button
            px="3xl"
            bg="transparent"
            borderColor={iOSColors.red}
            borderWidth={1}
            color={iOSColors.red}
            underlayColor="gray800"
            rounded="lg"
            fontWeight="500"
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel", "Delete All"],
                  cancelButtonIndex: 0,
                  destructiveButtonIndex: 1,
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    rootStore.removeItems();
                    navigation.goBack();
                  }
                }
              );
            }}
          >
            Delete All Items
          </Button>
        </Div>
      </Div>
    </Div>
  );
});

export default Settings;
