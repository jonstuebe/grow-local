import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Div, Icon, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";
import { rootStore } from "../state";

export default function NewItem() {
  const navigation = useNavigation();
  const {
    theme: { fontFamily, fontSize, spacing },
  } = useTheme();

  const [name, setName] = useState<string>("");
  const [initialAmount, setInitialAmount] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");

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
      style={{
        gap: spacing?.md,
      }}
    >
      <Div
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        py="lg"
        px="lg"
      >
        <Text color="white" fontSize="lg">
          Name
        </Text>
        <TextInput
          autoComplete="off"
          importantForAutofill="no"
          autoFocus
          style={{
            color: "white",
            fontFamily: fontFamily?.normal,
            fontSize: fontSize?.lg,
          }}
          placeholder="Item Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </Div>
      <Div
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        py="lg"
        px="lg"
      >
        <Text color="white" fontSize="lg">
          Initial Amount
        </Text>
        <TextInput
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          importantForAutofill="no"
          style={{
            color: "white",
            fontFamily: fontFamily?.normal,
            fontSize: fontSize?.lg,
          }}
          placeholder="Enter Amount"
          value={initialAmount ? initialAmount.toString() : ""}
          onChangeText={(text) => {
            setInitialAmount(text);
          }}
        />
      </Div>
      <Div
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        py="lg"
        px="lg"
      >
        <Text color="white" fontSize="lg">
          Goal Amount
        </Text>
        <TextInput
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          importantForAutofill="no"
          style={{
            color: "white",
            fontFamily: fontFamily?.normal,
            fontSize: fontSize?.lg,
          }}
          placeholder="Enter Amount"
          value={goalAmount ? goalAmount.toString() : ""}
          onChangeText={(text) => {
            setGoalAmount(text);
          }}
          onSubmitEditing={onSave}
        />
      </Div>
    </Div>
  );
}
