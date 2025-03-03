import { useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { z } from "zod";

import { List } from "../components/List";
import Row from "../components/List/Row";
import Section from "../components/List/Section";
import { useScreenHeader } from "../hooks/useScreenHeader";
import { useTextInput } from "../hooks/useTextInput";
import { useTrailingMenu } from "../hooks/useTrailingMenu";
import { rootStore } from "../state";
import { theme } from "../theme";
import { formatCurrency } from "../utils";

export default observer(function Transfer() {
  const navigation = useNavigation();
  const {
    label: fromLabel,
    actions: fromActions,
    onPressAction: onFromPressAction,
    selectedId: fromId,
    reset: resetFrom,
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

  const textInputProps = useTextInput({
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

  useScreenHeader({
    headerLeftActions: [
      {
        label: "Reset",
        color: theme.colors.red,
        onPress: () => {
          resetFrom();
          resetTo();
          textInputProps.onReset?.();
        },
      },
    ],
    headerRightActions: [
      {
        label: "Submit",
        onPress: onSubmit,
        disabled: !isValid,
      },
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
            <Row.Label>Transfer From</Row.Label>
            <Row.TrailingMenu
              actions={fromActions}
              onPressAction={onFromPressAction}
            >
              <Row.AccessoryLabel weight="medium">
                {fromLabel}
              </Row.AccessoryLabel>
              <Row.AccessoryIcon
                color="secondary"
                name="chevron.up.chevron.down"
                size={20}
              />
            </Row.TrailingMenu>
          </Row.Container>
          <Row.Container>
            <Row.Label>Transfer To</Row.Label>
            <Row.TrailingMenu
              actions={toActions}
              onPressAction={onToPressAction}
              disabled={toDisabled}
            >
              <Row.AccessoryLabel weight="medium">{toLabel}</Row.AccessoryLabel>
              <Row.AccessoryIcon
                color="secondary"
                name="chevron.up.chevron.down"
                size={20}
              />
            </Row.TrailingMenu>
          </Row.Container>
        </Section.Content>
      </Section.Container>
      <Row.Container>
        <Row.Label>Amount</Row.Label>
        <Row.Trailing>
          <Row.TextInput
            {...textInputProps}
            onSubmitEditing={isValid ? onSubmit : undefined}
          />
        </Row.Trailing>
      </Row.Container>
    </List.Container>
  );
});
