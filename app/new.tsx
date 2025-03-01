import { useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import { Switch } from "react-native";

import { List } from "../components/List";
import Row from "../components/List/Row";
import Section from "../components/List/Section";
import { useScreenHeader } from "../hooks/useScreenHeader";
import { useSwitch } from "../hooks/useSwitch";
import { useTextInput } from "../hooks/useTextInput";
import { rootStore } from "../state";
import { theme } from "../theme";
import validation from "../validation";

export default function NewItem() {
  const navigation = useNavigation();

  const goalSwitchProps = useSwitch();
  const nameInputProps = useTextInput({
    placeholder: "Enter Name",
    autoCapitalize: "none",
    autoComplete: "off",
    autoFocus: true,
    autoCorrect: false,
    importantForAutofill: "no",
  });
  const curAmountInputProps = useTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
  });
  const goalAmountInputProps = useTextInput({
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

  useScreenHeader({
    headerRightActions: [
      { label: "Save", onPress: onSave, disabled: !isValid },
    ],
  });

  return (
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
              <Switch {...goalSwitchProps} />
            </Row.Trailing>
          </Row.Container>
          {goalSwitchProps.value ? (
            <Row.Container>
              <Row.Label>Goal Amount</Row.Label>
              <Row.Trailing>
                <Row.TextInput {...goalAmountInputProps} />
              </Row.Trailing>
            </Row.Container>
          ) : null}
        </Section.Content>
      </Section.Container>
    </List.Container>
  );
}
