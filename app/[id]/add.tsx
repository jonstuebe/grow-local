import { useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { FieldGroup } from "../../components/FieldGroup";
import { PressableOpacity } from "../../components/PressableOpacity";
import { TextField } from "../../components/TextField";
import { rootStore } from "../../state";
import { theme } from "../../theme";
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
      headerRight: () => (
        <PressableOpacity onPress={onSave}>
          <Text
            style={[
              iOSUIKit.body,
              {
                color: iOSColors.blue,
              },
            ]}
          >
            Save
          </Text>
        </PressableOpacity>
      ),
    });
  }, [navigation, onSave]);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
      }}
    >
      <FieldGroup>
        <TextField
          label="Amount"
          error={error}
          keyboardType="decimal-pad"
          importantForAutofill="no"
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          onSubmitEditing={onSave}
          autoFocus
        />
      </FieldGroup>
    </View>
  );
});

export default Add;
