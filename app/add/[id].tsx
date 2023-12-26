import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Div, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { rootStore } from "../../state";
import { observer } from "mobx-react-lite";

const Add = observer(() => {
  const {
    theme: { fontSize, fontFamily },
  } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const item = rootStore.getItemById(params.id as string);

  const [amount, setAmount] = useState<string>("");

  const onSave = useCallback(() => {
    item?.incrementBy(Number(amount));
    if (navigation.canGoBack()) navigation.goBack();
  }, [item, amount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Deposit",
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
      headerRight: () => (
        <Pressable
          hitSlop={4}
          onPress={onSave}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
        >
          <Icon
            name="checkmark-outline"
            fontFamily="Ionicons"
            fontSize="4xl"
            color={iOSColors.green}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <Div mt="md">
      <Div
        bg="gray700"
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        py="lg"
        px="lg"
        rounded="md"
      >
        <Text color="white" fontSize="lg">
          Amount
        </Text>
        <TextInput
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          importantForAutofill="no"
          autoFocus
          style={{
            color: "white",
            fontFamily: fontFamily?.normal,
            fontSize: fontSize?.lg,
          }}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
          }}
          onSubmitEditing={onSave}
        />
      </Div>
    </Div>
  );
});

export default Add;
