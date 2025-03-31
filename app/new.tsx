import { Stack, useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ListContainer,
  RowContainer,
  RowLabel,
  RowSwitch,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  useRowTextInput,
  useRowSwitch,
  HeaderButton,
  useTheme,
} from "react-native-orchard";

import { rootStore } from "../state";
import validation from "../validation";

export default function NewItem() {
  const navigation = useNavigation();
  const { spacing } = useTheme();

  const { switchProps: goalSwitchProps } = useRowSwitch();
  const nameInputProps = useRowTextInput({
    placeholder: "Enter Name",
    autoCapitalize: "none",
    autoComplete: "off",
    autoFocus: true,
    autoCorrect: false,
    importantForAutofill: "no",
  });
  const curAmountInputProps = useRowTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
  });
  const goalAmountInputProps = useRowTextInput({
    placeholder: "Enter Goal Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
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

    rootStore.addItem({
      name: nameInputProps.value!,
      curAmount: parseFloat(curAmountInputProps.value!),
      goalAmount: goalSwitchProps.value
        ? parseFloat(goalAmountInputProps.value!)
        : undefined,
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
                  <RowTextInput {...goalAmountInputProps} />
                </RowTrailing>
              </RowContainer>
            ) : null}
          </SectionContent>
        </SectionContainer>
      </ListContainer>
    </>
  );
}
