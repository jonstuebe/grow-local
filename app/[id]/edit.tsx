import { BlurView } from "expo-blur";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { Div, Icon, Text, useTheme } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import {
  FieldContainer,
  FieldLabel,
  TextField,
} from "../../components/TextField";
import { rootStore } from "../../state";
import validation, { stringAsNumber } from "../../validation";
import { FieldGroup } from "../../components/FieldGroup";
import { useQuery } from "../../hooks/useQuery";
import { getItem } from "../../queries/item/detail";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { removeItem, updateItem } from "../../mutations/item";
import { useMutation } from "../../hooks/useMutation";
import { dollarsToCents } from "../../utils";

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

const Edit = observer(() => {
  const navigation = useNavigation();
  const {
    theme: { spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { status, result } = useQuery(getItem, [params.id as string]);
  const { mutate } = useMutation(updateItem);

  const form = useForm({
    defaultValues: {
      name: result?.name as string,
      cur_amount: String(result?.cur_amount as number),
      goal: result?.goal ?? false,
      goal_amount: result?.goal_amount
        ? String(result?.goal_amount)
        : undefined,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await mutate(params.id as string, {
        name: value.name,
        cur_amount: dollarsToCents(parseFloat(value.cur_amount as string)),
        goal: value.goal,
        goal_amount: value.goal
          ? value.goal_amount
            ? dollarsToCents(parseFloat(value.goal_amount))
            : undefined
          : undefined,
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });

  const curAmountRef = useRef<TextInput>(null);
  const goalAmountRef = useRef<TextInput>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Item",
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
        <Div flexDir="row" style={{ gap: spacing?.lg }}>
          <Pressable
            hitSlop={4}
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel", "Delete"],
                  cancelButtonIndex: 0,
                  destructiveButtonIndex: 1,
                },
                async (buttonIndex) => {
                  if (buttonIndex === 1) {
                    await removeItem(params.id as string);
                    navigation.goBack();
                  }
                }
              );
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
          >
            <Icon
              name="trash-outline"
              fontFamily="Ionicons"
              fontSize="4xl"
              color={iOSColors.red}
            />
          </Pressable>
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
        </Div>
      ),
    });
  }, [navigation, params.id, form.handleSubmit]);

  if (status === "rejected") {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="2xl" color={iOSColors.red}>
          Error
        </Text>
      </Div>
    );
  }

  if (status === "pending" || status === "idle") {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={iOSColors.blue} />
      </Div>
    );
  }

  return (
    <Div flex={1} mt="md" justifyContent="space-between">
      <ScrollView style={{ flex: 1 }}>
        <FieldGroup>
          <form.Field
            name="name"
            children={(field) => (
              <TextField
                label="Name"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                importantForAutofill="no"
                placeholder="Enter Name"
                value={field.state.value}
                onChangeText={field.handleChange}
                error={field.state.meta.errors?.[0]?.toString()}
                returnKeyType="next"
                onSubmitEditing={() => {
                  curAmountRef.current?.focus();
                }}
              />
            )}
          />
          <form.Field
            name="cur_amount"
            children={(field) => (
              <TextField
                label="Current Amount"
                keyboardType="decimal-pad"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                importantForAutofill="no"
                placeholder="Enter Amount"
                value={field.state.value}
                onChangeText={field.handleChange}
                error={field.state.meta.errors?.[0]?.toString()}
                ref={curAmountRef}
                returnKeyType="next"
                onSubmitEditing={() => {
                  goalAmountRef.current?.focus();
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
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        importantForAutofill="no"
                        placeholder="Enter Amount"
                        value={field.state.value}
                        error={field.state.meta.errors?.[0]?.toString()}
                        onChangeText={field.handleChange}
                        onSubmitEditing={form.handleSubmit}
                        ref={goalAmountRef}
                      />
                    )}
                  />
                ) : null}
              </>
            )}
          />
        </FieldGroup>
      </ScrollView>
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <Link
          asChild
          href={{
            pathname: "/[id]/transactions",
            params: { id: params.id as string },
          }}
        >
          <Pressable
            style={{
              width: "100%",
              paddingTop: spacing?.lg,
              paddingBottom: insets.bottom === 0 ? spacing?.lg : 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing?.md,
            }}
          >
            {({ pressed }) => (
              <Text
                fontSize="2xl"
                color={iOSColors.blue}
                textAlign="center"
                opacity={pressed ? 0.8 : 1}
              >
                View Transactions
              </Text>
            )}
          </Pressable>
        </Link>
      </BlurView>
    </Div>
  );
});

export default Edit;
