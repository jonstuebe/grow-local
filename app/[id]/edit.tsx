import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { ActionSheetIOS, View } from "react-native";

import { Button } from "../../components/Button";
import { List } from "../../components/List";
import Row from "../../components/List/Row";
import Section from "../../components/List/Section";
import { useScreenHeader } from "../../hooks/useScreenHeader";
import { useSwitch } from "../../hooks/useSwitch";
import { useTextInput } from "../../hooks/useTextInput";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import validation from "../../validation";

const Edit = observer(() => {
  const navigation = useNavigation();
  const { id, name, curAmount, goal, goalAmount } = useLocalSearchParams<{
    id: string;
    name?: string;
    curAmount?: string;
    goal?: string;
    goalAmount?: string;
  }>();

  const { switchProps: goalSwitchProps } = useSwitch(goal === "true");
  const nameInputProps = useTextInput({
    placeholder: "Enter Name",
    autoCapitalize: "none",
    autoComplete: "off",
    autoFocus: true,
    autoCorrect: false,
    importantForAutofill: "no",
    defaultValue: name,
  });
  const curAmountInputProps = useTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
    defaultValue: curAmount,
  });
  const goalAmountInputProps = useTextInput({
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

  useScreenHeader({
    headerLeftActions: [
      {
        label: "Delete",
        color: theme.colors.red,
        onPress: () => {
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
        },
      },
    ],
    headerRightActions: [
      {
        label: "Save",
        onPress: onSave,
        disabled: !isValid,
      },
    ],
  });

  return (
    <View style={{ gap: 8 }}>
      <List.Container
        style={{
          marginTop: theme.spacing.xl,
        }}
      >
        <Section.Container>
          <Section.Content>
            <Row.Container>
              <Row.Label>Name</Row.Label>
              <Row.Trailing>
                <Row.TextInput {...nameInputProps} />
              </Row.Trailing>
            </Row.Container>
            <Row.Container>
              <Row.Label>Current Amount</Row.Label>
              <Row.Trailing>
                <Row.TextInput {...curAmountInputProps} />
              </Row.Trailing>
            </Row.Container>
            <Row.Container>
              <Row.Label>Goal</Row.Label>
              <Row.Trailing>
                <Row.Switch {...goalSwitchProps} />
              </Row.Trailing>
            </Row.Container>
            {goalSwitchProps.value ? (
              <Row.Container>
                <Row.Label>Goal Amount</Row.Label>
                <Row.Trailing>
                  <Row.TextInput
                    {...goalAmountInputProps}
                    onSubmitEditing={onSave}
                  />
                </Row.Trailing>
              </Row.Container>
            ) : null}
          </Section.Content>
        </Section.Container>
      </List.Container>
      <Link href={{ pathname: "/[id]/transactions", params: { id } }} asChild>
        <Button variant="plain" textStyle={{ fontSize: theme.fontSize.xl }}>
          Transactions
        </Button>
      </Link>
    </View>
  );
});

export default Edit;
