import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Pressable, Switch, TextInput } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { FieldContainer, FieldLabel, TextField } from "../components/TextField";
import { rootStore } from "../state";
import validation from "../validation";
import { FieldGroup } from "../components/FieldGroup";

export default function NewItem() {
  const navigation = useNavigation();
  const {
    theme: { spacing },
  } = useTheme();

  const [name, setName] = useState<string>("");
  const [curAmount, setCurAmount] = useState<string>("");
  const [goal, setGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState<string>("");

  const [errors, setErrors] = useState<{
    name?: string;
    goalAmount?: string;
    curAmount?: string;
  }>({});

  const curAmountRef = useRef<TextInput>(null);
  const goalAmountRef = useRef<TextInput>(null);

  const onSave = useCallback(() => {
    const result = validation.item.safeParse({
      name,
      curAmount,
      goal,
      goalAmount,
    });

    if (result.success) {
      rootStore.addItem(result.data);
      navigation.goBack();
    } else {
      let errors: { name?: string; goalAmount?: string; curAmount?: string } =
        {};
      if (result.error.formErrors.fieldErrors.name) {
        errors.name = result.error.formErrors.fieldErrors.name[0];
      }
      if (result.error.formErrors.fieldErrors.curAmount) {
        errors.curAmount = result.error.formErrors.fieldErrors.curAmount[0];
      }
      if (result.error.formErrors.fieldErrors.goalAmount) {
        errors.goalAmount = result.error.formErrors.fieldErrors.goalAmount[0];
      }

      setErrors(errors);
    }
  }, [navigation, name, goal, goalAmount, curAmount]);

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
  }, [navigation, name, curAmount, goalAmount]);

  return (
    <Div mt="md">
      <FieldGroup>
        <TextField
          label="Name"
          error={errors.name}
          autoComplete="off"
          importantForAutofill="no"
          autoFocus
          placeholder="Item Name"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            curAmountRef.current?.focus();
          }}
        />
        <TextField
          label="Current Amount"
          error={errors.curAmount}
          importantForAutofill="no"
          placeholder="Enter Amount"
          keyboardType="decimal-pad"
          value={curAmount ? curAmount.toString() : ""}
          onChangeText={setCurAmount}
          ref={curAmountRef}
          returnKeyType="next"
          onSubmitEditing={() => {
            goalAmountRef.current?.focus();
          }}
        />
        <FieldContainer>
          <FieldLabel>Goal</FieldLabel>
          <Switch value={goal} onValueChange={setGoal} />
        </FieldContainer>
        {goal ? (
          <TextField
            label="Goal Amount"
            // helperText="optional"
            error={errors.goalAmount}
            keyboardType="decimal-pad"
            importantForAutofill="no"
            placeholder="Enter Amount"
            value={goalAmount ? goalAmount.toString() : ""}
            onChangeText={setGoalAmount}
            onSubmitEditing={onSave}
            ref={goalAmountRef}
          />
        ) : null}
      </FieldGroup>
    </Div>
  );
}
