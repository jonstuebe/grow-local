import { Button, Div, Text, useTheme } from "react-native-magnus";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FieldContainer, FieldLabel } from "../components/TextField";
import { observer } from "mobx-react-lite";
import { rootStore } from "../state";
import { iOSColors } from "react-native-typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionSheetIOS } from "react-native";
import { useNavigation } from "expo-router";

const itemSizeMap = {
  small: 0,
  large: 1,
};

const Settings = observer(() => {
  const {
    theme: { spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Div flex={1} position="relative">
      <Div
        mt="md"
        bg="gray700"
        rounded="md"
        overflow="hidden"
        style={{
          gap: spacing?.md,
        }}
      ></Div>
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
