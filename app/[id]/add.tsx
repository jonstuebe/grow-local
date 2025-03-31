import { useLocalSearchParams, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import {
  Button,
  ListContainer,
  RowContainer,
  RowLabel,
  RowTextInput,
  RowTrailing,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
  useRowTextInput,
} from "react-native-orchard";

import { rootStore } from "../../state";
import validation from "../../validation";

const Add = observer(() => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const amountInputProps = useRowTextInput({
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
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <ListContainer>
        <RowContainer>
          <RowLabel>Amount</RowLabel>
          <RowTrailing>
            <RowTextInput {...amountInputProps} onSubmitEditing={onSave} />
          </RowTrailing>
        </RowContainer>
        <Button onPress={onSave} disabled={!isValid}>
          Deposit
        </Button>
      </ListContainer>
    </>
  );
});

export default Add;
