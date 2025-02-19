import { useForm } from "@tanstack/react-form";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { Div, Icon } from "react-native-magnus";
import { iOSColors } from "react-native-typography";
import { z } from "zod";

import { FieldGroup } from "../../components/FieldGroup";
import { TextField } from "../../components/TextField";
import { useMutation } from "../../hooks/useMutation";
import { addWithdrawal } from "../../mutations/transaction";
import { dollarsToCents } from "../../utils";
import { stringAsNumber } from "../../validation";

const schema = z.object({
  amount: stringAsNumber(),
});

function Remove() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { mutate } = useMutation(addWithdrawal);

  const form = useForm({
    defaultValues: {
      amount: undefined,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await mutate({
        item_id: params.id as string,
        amount: dollarsToCents(parseFloat(value.amount as string)),
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });

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
          onPress={form.handleSubmit}
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
  }, [navigation, form.handleSubmit]);

  return (
    <Div mt="md">
      <FieldGroup>
        <form.Field
          name="amount"
          children={(field) => (
            <TextField
              label="Amount"
              error={field.state.meta.errors?.[0]?.toString()}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              importantForAutofill="no"
              autoFocus
              placeholder="Enter Amount"
              value={field.state.value}
              onChangeText={field.handleChange}
              onSubmitEditing={form.handleSubmit}
            />
          )}
        />
      </FieldGroup>
    </Div>
  );
}

export default Remove;
