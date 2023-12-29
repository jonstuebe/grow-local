import { BlurView } from "expo-blur";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { Div, Icon, Text, useTheme } from "react-native-magnus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors } from "react-native-typography";

import {
  FieldContainer,
  FieldLabel,
  TextField,
} from "../../components/TextField";
import { rootStore } from "../../state";
import validation from "../../validation";
import { FieldGroup } from "../../components/FieldGroup";

const Edit = observer(() => {
  const navigation = useNavigation();
  const {
    theme: { spacing },
  } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  const [name, setName] = useState(() => item?.name ?? "");
  const [goal, setGoal] = useState<boolean>(() => item?.goal ?? false);
  const [curAmount, setCurAmount] = useState(
    () => String(item?.curAmount) ?? ""
  );
  const [goalAmount, setGoalAmount] = useState(
    () => String(item?.goalAmount) ?? ""
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
      title: "Edit Item",
      headerLeft: () => (
        <Pressable
          hitSlop={4}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
        >
          <Icon
            name="close-outline"
            fontFamily="Ionicons"
            fontSize="4xl"
            color="gray300"
          />
        </Pressable>
      ),
      headerRight: () => (
        <Div flexDir="row" style={{ gap: spacing?.lg }}>
          <Pressable
            hitSlop={4}
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel", "Delete"],
                  cancelButtonIndex: 0,
                  destructiveButtonIndex: 1,
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                    rootStore.removeItem(id);
                    navigation.goBack();
                  }
                }
              );
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
          >
            <Icon
              name="trash-outline"
              fontFamily="Ionicons"
              fontSize="4xl"
              color={iOSColors.red}
            />
          </Pressable>
          <Pressable
            hitSlop={4}
            onPress={onSave}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : undefined })}
          >
            <Icon
              name="checkmark-outline"
              fontFamily="Ionicons"
              fontSize="4xl"
              color={iOSColors.green}
            />
          </Pressable>
        </Div>
      ),
    });
  }, [navigation, id, onSave]);

  return (
    <Div flex={1} mt="md" justifyContent="space-between">
      <ScrollView style={{ flex: 1 }}>
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
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <Link asChild href={{ pathname: "/[id]/transactions", params: { id } }}>
          <Pressable
            style={{
              width: "100%",
              paddingTop: spacing?.lg,
              paddingBottom: insets.bottom === 0 ? spacing?.lg : 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing?.md,
            }}
          >
            {({ pressed }) => (
              <Text
                fontSize="2xl"
                color={iOSColors.blue}
                textAlign="center"
                opacity={pressed ? 0.8 : 1}
              >
                View Transactions
              </Text>
            )}
          </Pressable>
        </Link>
      </BlurView>
    </Div>
  );
});

export default Edit;
