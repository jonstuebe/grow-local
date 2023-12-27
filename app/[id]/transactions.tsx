import { useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { Icon } from "react-native-magnus";

const Transactions = observer(() => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Transactions",
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
    });
  }, [navigation]);

  return null;
});

export default Transactions;
