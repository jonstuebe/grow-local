import { formatRelative } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { upperFirst } from "lodash-es";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView } from "react-native";
import { Div, Icon, Text, useTheme } from "react-native-magnus";

import { rootStore } from "../../state";
import { formatCurrency } from "../../utils";
import { FieldGroup } from "../../components/FieldGroup";

const Transactions = observer(() => {
  const {
    theme: { spacing },
  } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

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

  return (
    <ScrollView style={{ flex: 1 }}>
      <Div mt="md">
        <FieldGroup>
          {item?.transactions
            .slice()
            .reverse()
            .map((transaction, idx) => (
              <Div
                key={idx}
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                px="lg"
                py="lg"
              >
                <Div style={{ gap: spacing?.xs }}>
                  <Text color="white" fontSize="lg">
                    {upperFirst(transaction.type)}
                  </Text>
                  <Text color="gray200" fontSize="md">
                    {upperFirst(formatRelative(transaction.date, new Date()))}
                  </Text>
                </Div>
                <Text color="white" fontSize="lg">
                  {formatCurrency(transaction.amount)}
                </Text>
              </Div>
            ))}
        </FieldGroup>
      </Div>
    </ScrollView>
  );
});

export default Transactions;
