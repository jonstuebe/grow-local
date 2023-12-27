import { useLocalSearchParams, useNavigation } from "expo-router";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ActionSheetIOS, Pressable, TextInput } from "react-native";
import { Div, Icon, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

import { TextField } from "../../components/TextField";
import { rootStore } from "../../state";

const Edit = observer(() => {
  const navigation = useNavigation();
  const {
    theme: { spacing },
  } = useTheme();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  const [name, setName] = useState(() => item?.name ?? "");
  const [curAmount, setCurAmount] = useState(
    () => String(item?.curAmount) ?? ""
  );
  const [goalAmount, setGoalAmount] = useState(
    () => String(item?.goalAmount) ?? ""
  );

  const curAmountRef = useRef<TextInput>(null);
  const goalAmountRef = useRef<TextInput>(null);

  const onSave = useCallback(() => {
    rootStore.updateItem(id, {
      name,
      curAmount: Number(curAmount),
      goalAmount: Number(goalAmount),
    });
    navigation.goBack();
  }, [navigation, name, curAmount, goalAmount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit",
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
    <Div mt="md" rounded="md" overflow="hidden">
      <TextField
        autoFocus
        label="Name"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill="no"
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
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
        onChangeText={setCurAmount}
        ref={curAmountRef}
        returnKeyType="next"
        onSubmitEditing={() => {
          goalAmountRef.current?.focus();
        }}
      />
      <TextField
        label="Goal Amount"
        keyboardType="decimal-pad"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
        placeholder="Enter Amount"
        value={goalAmount}
        onChangeText={setGoalAmount}
        onSubmitEditing={onSave}
        ref={goalAmountRef}
      />
    </Div>
  );
});

export default Edit;
