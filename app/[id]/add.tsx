import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";

import { HeaderButton } from "../../components/HeaderButton";
import { List } from "../../components/List";
import Row from "../../components/List/Row";
import { useTextInput } from "../../hooks/useTextInput";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import validation from "../../validation";
import { Button } from "../../components/Button";
import { SheetHeader } from "../../components/SheetHeader";

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

  return (
    <>
      <SheetHeader.Container>
        <SheetHeader.CloseButton />
      </SheetHeader.Container>
      <List.Container>
        <Row.Container>
          <Row.Label>Amount</Row.Label>
          <Row.Trailing>
            <Row.TextInput {...amountInputProps} onSubmitEditing={onSave} />
          </Row.Trailing>
        </Row.Container>
        <Button onPress={onSave} disabled={!isValid}>
          Deposit
        </Button>
      </List.Container>
    </>
  );
});

export default Add;
