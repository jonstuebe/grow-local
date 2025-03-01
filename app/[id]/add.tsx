import { useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";

import { List } from "../../components/List";
import Row from "../../components/List/Row";
import { useScreenHeader } from "../../hooks/useScreenHeader";
import { useTextInput } from "../../hooks/useTextInput";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import validation from "../../validation";

const Add = observer(() => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const amountInputProps = useTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
    importantForAutofill: "no",
    autoFocus: true,
  });

  const isValid = useMemo(() => {
    const result = validation.amountChange.safeParse({
      amount: amountInputProps.value,
    });

    return result.success;
  }, [amountInputProps.value]);

  const onSave = useCallback(() => {
    if (!isValid) return;

    rootStore
      .getItemById(params.id as string)
      ?.incrementBy(parseFloat(amountInputProps.value!));
    navigation.goBack();
  }, [isValid, amountInputProps.value]);

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
      <Row.Container>
        <Row.Label>Amount</Row.Label>
        <Row.Trailing>
          <Row.TextInput {...amountInputProps} onSubmitEditing={onSave} />
        </Row.Trailing>
      </Row.Container>
    </List.Container>
  );
});

export default Add;
