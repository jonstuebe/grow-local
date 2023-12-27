import { useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import { Div, Icon } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { TextField } from "../../components/TextField";
import { rootStore } from "../../state";

const Remove = observer(() => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const item = rootStore.getItemById(params.id as string);

  const [amount, setAmount] = useState<string>("");

  const onSave = useCallback(() => {
    item?.decrementBy(Number(amount));
    if (navigation.canGoBack()) navigation.goBack();
  }, [item, amount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Withdrawal",
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
      <TextField
        label="Amount"
        keyboardType="decimal-pad"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
        autoFocus
        placeholder="Enter Amount"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
        }}
        onSubmitEditing={onSave}
      />
    </Div>
  );
});

export default Remove;
