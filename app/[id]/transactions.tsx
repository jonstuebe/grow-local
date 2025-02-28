import { formatRelative } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { upperFirst } from "lodash-es";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { ScrollView, Text, View } from "react-native";

import { FieldGroup } from "../../components/FieldGroup";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import { formatCurrency } from "../../utils";

const Transactions = observer(() => {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
      }}
    >
      <FieldGroup>
        {item?.transactions
          .slice()
          .reverse()
          .map((transaction, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.lg,
              }}
            >
              <View style={{ gap: theme.spacing.xs }}>
                <Text
                  style={{
                    color: theme.colors.white,
                    fontSize: theme.fontSize.lg,
                  }}
                >
                  {upperFirst(transaction.type)}
                </Text>
                <Text
                  style={{
                    color: theme.colors.gray200,
                    fontSize: theme.fontSize.md,
                  }}
                >
                  {upperFirst(formatRelative(transaction.date, new Date()))}
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.white,
                  fontSize: theme.fontSize.lg,
                }}
              >
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))}
      </FieldGroup>
    </ScrollView>
  );
});

export default Transactions;
