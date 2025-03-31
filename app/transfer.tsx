import { useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import {
  Button,
  ListContainer,
  RowAccessoryIcon,
  RowAccessoryLabel,
  RowContainer,
  RowLabel,
  RowTextInput,
  RowTrailing,
  RowTrailingMenu,
  SectionContainer,
  SectionContent,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
  useTrailingMenu,
  useRowTextInput,
} from "react-native-orchard";
import { z } from "zod";

import { rootStore } from "../state";
import { formatCurrency } from "../utils";

export default observer(function Transfer() {
  const navigation = useNavigation();
  const {
    label: fromLabel,
    actions: fromActions,
    onPressAction: onFromPressAction,
    selectedId: fromId,
  } = useTrailingMenu({
    actions: rootStore.itemsArray.map(([id, item]) => ({
      id,
      title: `${item.name}: ${formatCurrency(item.curAmount)}`,
      attributes: {
        disabled: item.curAmount === 0,
      },
    })),
    defaultLabel: "Select an account",
  });

  const {
    label: toLabel,
    actions: toActions,
    onPressAction: onToPressAction,
    selectedId: toId,
    reset: resetTo,
    disabled: toDisabled,
  } = useTrailingMenu({
    actions: rootStore.itemsArray
      .map(([id, item]) => ({
        id,
        title: `${item.name}: ${formatCurrency(item.curAmount)}`,
      }))
      .filter(({ id }) => id !== fromId),
    defaultLabel: "Select an account",
    disabled: !fromId,
  });

  const textInputProps = useRowTextInput({
    placeholder: "Enter Amount",
    keyboardType: "decimal-pad",
  });

  const isValid = useMemo(() => {
    const fromItem = fromId ? rootStore.getItemById(fromId) : undefined;

    const schema = z
      .object({
        fromId: z.string(),
        toId: z.string(),
        amount: z.coerce
          .number()
          .min(0)
          .max(fromItem?.curAmount ?? Number.MAX_SAFE_INTEGER),
      })
      .refine((data) => data.fromId !== data.toId, {
        message: "Transfer must be from different accounts",
        path: ["toId"],
      });

    const result = schema.safeParse({
      fromId,
      toId,
      amount: textInputProps.value,
    });

    return result.success;
  }, [fromId, toId, textInputProps.value]);

  const onSubmit = useCallback(() => {
    if (!isValid) return;
    rootStore.transfer(fromId!, toId!, parseFloat(textInputProps.value!));
    navigation.goBack();
  }, [fromId, toId, textInputProps.value, isValid]);

  return (
    <>
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <ListContainer>
        <SectionContainer>
          <SectionContent>
            <RowContainer>
              <RowLabel>Transfer From</RowLabel>
              <RowTrailingMenu
                actions={fromActions}
                onPressAction={onFromPressAction}
              >
                <RowAccessoryLabel weight="medium">
                  {fromLabel}
                </RowAccessoryLabel>
                <RowAccessoryIcon
                  color="secondary"
                  name="chevron.up.chevron.down"
                  size={20}
                />
              </RowTrailingMenu>
            </RowContainer>
            <RowContainer>
              <RowLabel>Transfer To</RowLabel>
              <RowTrailingMenu
                actions={toActions}
                onPressAction={onToPressAction}
                disabled={toDisabled}
              >
                <RowAccessoryLabel weight="medium">{toLabel}</RowAccessoryLabel>
                <RowAccessoryIcon
                  color="secondary"
                  name="chevron.up.chevron.down"
                  size={20}
                />
              </RowTrailingMenu>
            </RowContainer>
          </SectionContent>
        </SectionContainer>
        <RowContainer>
          <RowLabel>Amount</RowLabel>
          <RowTrailing>
            <RowTextInput
              {...textInputProps}
              onSubmitEditing={isValid ? onSubmit : undefined}
            />
          </RowTrailing>
        </RowContainer>
        <Button
          variant={!isValid ? "gray" : "filled"}
          disabled={!isValid}
          onPress={onSubmit}
        >
          Transfer
        </Button>
      </ListContainer>
    </>
  );
});
