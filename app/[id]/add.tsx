import { useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import { Div, Icon } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { TextField } from "../../components/TextField";
import { rootStore } from "../../state";
import validation from "../../validation";

const Add = observer(() => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  const onSave = useCallback(() => {
    if (amount === "") {
      setError("Please enter an amount");
      return;
    }

    const result = validation.amountChange.safeParse({
      amount,
    });

    if (result.success) {
      rootStore
        .getItemById(params.id as string)
        ?.incrementBy(result.data.amount);
      navigation.goBack();
    } else {
      if (result.error.formErrors.fieldErrors.amount) {
        setError(result.error.formErrors.fieldErrors.amount[0]);
      }
    }
  }, [amount]);

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
  }, [navigation, onSave]);

  return (
    <Div mt="md" overflow="hidden" rounded="md" bg="gray700">
      <TextField
        label="Amount"
        error={error}
        keyboardType="decimal-pad"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
        autoFocus
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        onSubmitEditing={onSave}
      />
    </Div>
  );
});

export default Add;
