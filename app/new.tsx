import { useForm } from "@tanstack/react-form";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef } from "react";
import { Pressable, Switch, TextInput } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";
import { z } from "zod";

import { FieldGroup } from "../components/FieldGroup";
import { FieldContainer, FieldLabel, TextField } from "../components/TextField";
import { useMutation } from "../hooks/useMutation";
import { addItem } from "../mutations/item";
import { stringAsNumber } from "../validation";
import { dollarsToCents } from "../utils";

const schema = z
  .object({
    name: z.string().min(1).max(25),
    cur_amount: stringAsNumber(),
    goal: z.boolean().default(false),
    goal_amount: stringAsNumber().optional(),
  })
  .refine(({ goal, goal_amount }) => {
    if (goal === true) {
      if (goal_amount === undefined || goal_amount === "") {
        return false;
      }
      if (parseFloat(goal_amount) < 1) {
        return false;
      }
    }

    return true;
  });

export default function NewItem() {
  const navigation = useNavigation();

  const { mutate } = useMutation(addItem);
  const form = useForm({
    defaultValues: {
      name: "",
      cur_amount: undefined,
      goal: false,
      goal_amount: undefined,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await mutate({
        name: value.name,
        cur_amount: value.cur_amount
          ? dollarsToCents(parseFloat(value.cur_amount))
          : 0,
        goal: value.goal,
        goal_amount: value.goal
          ? value.goal_amount
            ? dollarsToCents(parseFloat(value.goal_amount))
            : 0
          : undefined,
      });
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });

  const cur_amountRef = useRef<TextInput>(null);
  const goal_amountRef = useRef<TextInput>(null);

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
  }, [navigation]);

  return (
    <Div mt="md">
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => (
            <TextField
              label="Name"
              error={field.state.meta.errors?.[0]?.toString()}
              autoComplete="off"
              importantForAutofill="no"
              autoFocus
              placeholder="Item Name"
              value={field.state.value}
              onChangeText={field.handleChange}
              returnKeyType="next"
              onSubmitEditing={() => {
                cur_amountRef.current?.focus();
              }}
            />
          )}
        />

        <form.Field
          name="cur_amount"
          children={(field) => (
            <TextField
              label="Current Amount"
              error={field.state.meta.errors?.[0]?.toString()}
              importantForAutofill="no"
              placeholder="Enter Amount"
              keyboardType="decimal-pad"
              value={field.state.value}
              onChangeText={field.handleChange}
              ref={cur_amountRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                goal_amountRef.current?.focus();
              }}
            />
          )}
        />

        <form.Field
          name="goal"
          children={(field) => (
            <>
              <FieldContainer>
                <FieldLabel>Goal</FieldLabel>
                <Switch
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FieldContainer>
              {field.state.value ? (
                <form.Field
                  name="goal_amount"
                  children={(field) => (
                    <TextField
                      label="Goal Amount"
                      error={field.state.meta.errors?.[0]?.toString()}
                      keyboardType="decimal-pad"
                      importantForAutofill="no"
                      placeholder="Enter Amount"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onSubmitEditing={form.handleSubmit}
                      ref={goal_amountRef}
                    />
                  )}
                />
              ) : null}
            </>
          )}
        />
      </FieldGroup>
    </Div>
  );
}
