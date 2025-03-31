import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { ActionSheetIOS } from "react-native";
import {
  Button,
  ListContainer,
  RowContainer,
  HeaderButton,
  RowLabel,
  RowSwitch,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  useRowSwitch,
  useRowTextInput,
  useTheme,
} from "react-native-orchard";
import { computed } from "mobx";

import { rootStore } from "../../state";
import validation from "../../validation";

const Edit = observer(() => {
  const navigation = useNavigation();
  const { spacing } = useTheme();
  const { id, name, curAmount, goal, goalAmount } = useLocalSearchParams<{
    id: string;
    name?: string;
    curAmount?: string;
    goal?: string;
    goalAmount?: string;
  }>();
  const transactions = computed(
    () => rootStore.getItemById(id)?.transactions
  ).get();

  const { switchProps: goalSwitchProps } = useRowSwitch(goal === "true");
  const nameInputProps = useRowTextInput({
    placeholder: "Enter Name",
    autoCapitalize: "none",
    autoComplete: "off",
    autoFocus: true,
    autoCorrect: false,
    importantForAutofill: "no",
    defaultValue: name,
  });
  const curAmountInputProps = useRowTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
    defaultValue: curAmount,
  });
  const goalAmountInputProps = useRowTextInput({
    placeholder: "Enter Goal Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
    defaultValue: goalAmount,
  });

  const isValid = useMemo(() => {
    const result = validation.item.safeParse({
      name: nameInputProps.value,
      curAmount: curAmountInputProps.value,
      goal: goalSwitchProps.value,
      goalAmount: goalAmountInputProps.value,
    });

    return result.success;
  }, [
    nameInputProps.value,
    curAmountInputProps.value,
    goalSwitchProps.value,
    goalAmountInputProps.value,
  ]);

  const onSave = useCallback(() => {
    if (!isValid) return;

    rootStore.updateItem(id, {
      name: nameInputProps.value,
      curAmount: parseFloat(curAmountInputProps.value!),
      goal: goalSwitchProps.value,
      goalAmount: parseFloat(goalAmountInputProps.value!),
    });
    navigation.goBack();
  }, [
    isValid,
    nameInputProps.value,
    curAmountInputProps.value,
    goalSwitchProps.value,
    goalAmountInputProps.value,
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit",
          headerLeft: () => (
            <HeaderButton
              title="Delete"
              destructive
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
            />
          ),
          headerRight: () => (
            <HeaderButton title="Save" onPress={onSave} disabled={!isValid} />
          ),
        }}
      />
      <ListContainer
        style={{
          marginTop: spacing.xl,
        }}
      >
        <SectionContainer>
          <SectionContent>
            <RowContainer>
              <RowLabel>Name</RowLabel>
              <RowTrailing>
                <RowTextInput {...nameInputProps} />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Current Amount</RowLabel>
              <RowTrailing>
                <RowTextInput {...curAmountInputProps} />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Goal</RowLabel>
              <RowTrailing>
                <RowSwitch {...goalSwitchProps} />
              </RowTrailing>
            </RowContainer>
            {goalSwitchProps.value ? (
              <RowContainer>
                <RowLabel>Goal Amount</RowLabel>
                <RowTrailing>
                  <RowTextInput
                    {...goalAmountInputProps}
                    onSubmitEditing={onSave}
                  />
                </RowTrailing>
              </RowContainer>
            ) : null}
          </SectionContent>
        </SectionContainer>
        {(transactions ?? []).length > 0 ? (
          <Link
            href={{ pathname: "/[id]/transactions", params: { id } }}
            asChild
          >
            <Button variant="gray" fontWeight="500">
              Transactions
            </Button>
          </Link>
        ) : null}
      </ListContainer>
    </>
  );
});

export default Edit;
