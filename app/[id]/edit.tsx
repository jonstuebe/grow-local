import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Button,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { ConfirmMenu } from "../../components/ConfirmMenu";
import { FieldGroup } from "../../components/FieldGroup";
import { PressableOpacity } from "../../components/PressableOpacity";
import {
  FieldContainer,
  FieldLabel,
  TextField,
} from "../../components/TextField";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import validation from "../../validation";

const Edit = observer(() => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  const [name, setName] = useState(() => item?.name ?? "");
  const [goal, setGoal] = useState<boolean>(() => item?.goal ?? false);
  const [curAmount, setCurAmount] = useState(
    () => String(item?.curAmount) ?? ""
  );
  const [goalAmount, setGoalAmount] = useState(() =>
    item?.goalAmount ? String(item.goalAmount) : ""
  );

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
      goalAmount,
    });

    if (result.success) {
      rootStore.updateItem(id, {
        name,
        curAmount: Number(curAmount),
        goal,
        goalAmount: Number(goalAmount),
      });
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
  }, [navigation, name, goal, curAmount, goalAmount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <PressableOpacity
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: "Delete Item",
                options: ["Delete", "Cancel"],
                destructiveButtonIndex: 0,
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  rootStore.removeItem(id);
                  navigation.goBack();
                }
              }
            );
          }}
        >
          <Text
            style={[
              iOSUIKit.body,
              {
                color: iOSColors.red,
              },
            ]}
          >
            Delete
          </Text>
        </PressableOpacity>
      ),
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
  }, [navigation, id, onSave]);

  return (
    <View
      style={{
        flex: 1,
        marginTop: theme.spacing.md,
        justifyContent: "space-between",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.md,
        }}
      >
        <FieldGroup>
          <TextField
            label="Name"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            importantForAutofill="no"
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            returnKeyType="next"
            onSubmitEditing={() => {
              curAmountRef.current?.focus();
            }}
          />
          <TextField
            label="Current Amount"
            keyboardType="decimal-pad"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            importantForAutofill="no"
            placeholder="Enter Amount"
            value={curAmount}
            error={errors.curAmount}
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
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              importantForAutofill="no"
              placeholder="Enter Amount"
              value={goalAmount}
              error={errors.goalAmount}
              onChangeText={setGoalAmount}
              onSubmitEditing={onSave}
              ref={goalAmountRef}
            />
          ) : null}
        </FieldGroup>
      </ScrollView>
      <Link
        disabled={(item?.transactions ?? []).length === 0}
        asChild
        href={{ pathname: "/[id]/transactions", params: { id } }}
      >
        <PressableOpacity>
          <Text
            style={[
              iOSUIKit.body,
              {
                textAlign: "center",
                paddingVertical: 8,
                color: iOSColors.blue,
                opacity: (item?.transactions ?? []).length === 0 ? 0.5 : 1,
              },
            ]}
          >
            View Transactions
          </Text>
        </PressableOpacity>
      </Link>
    </View>
  );
});

export default Edit;
