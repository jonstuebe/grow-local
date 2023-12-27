import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Pressable, TextInput } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { TextField } from "../components/TextField";
import { rootStore } from "../state";

export default function NewItem() {
  const navigation = useNavigation();
  const {
    theme: { spacing },
  } = useTheme();

  const [name, setName] = useState<string>("");
  const [initialAmount, setInitialAmount] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");

  const initialAmountRef = useRef<TextInput>(null);
  const goalAmountRef = useRef<TextInput>(null);

  const onSave = useCallback(() => {
    rootStore.addItem({
      name,
      curAmount: Number(initialAmount),
      goalAmount: Number(goalAmount),
    });
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation, name, goalAmount, initialAmount]);

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
  }, [navigation, name, initialAmount, goalAmount]);

  return (
    <Div
      mt="md"
      bg="gray700"
      rounded="md"
      overflow="hidden"
      style={{
        gap: spacing?.md,
      }}
    >
      <TextField
        label="Name"
        autoComplete="off"
        importantForAutofill="no"
        autoFocus
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => {
          initialAmountRef.current?.focus();
        }}
      />
      <TextField
        label="Initial Amount"
        importantForAutofill="no"
        placeholder="Enter Amount"
        keyboardType="decimal-pad"
        value={initialAmount ? initialAmount.toString() : ""}
        onChangeText={setInitialAmount}
        ref={initialAmountRef}
        returnKeyType="next"
        onSubmitEditing={() => {
          goalAmountRef.current?.focus();
        }}
      />
      <TextField
        label="Goal Amount"
        keyboardType="decimal-pad"
        importantForAutofill="no"
        placeholder="Enter Amount"
        value={goalAmount ? goalAmount.toString() : ""}
        onChangeText={setGoalAmount}
        onSubmitEditing={onSave}
        ref={goalAmountRef}
      />
    </Div>
  );
}
