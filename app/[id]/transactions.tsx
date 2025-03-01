import { formatRelative } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { upperFirst } from "lodash-es";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native";

import { List } from "../../components/List";
import Row from "../../components/List/Row";
import Section from "../../components/List/Section";
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
      }}
      contentContainerStyle={{
        marginTop: theme.spacing.xl,
      }}
    >
      <List.Container>
        <Section.Container>
          <Section.Content>
            {item?.transactions
              .slice()
              .reverse()
              .map((transaction, idx) => (
                <Row.Container key={idx}>
                  <Row.Content>
                    <Row.Label>{upperFirst(transaction.type)}</Row.Label>
                    <Row.Label variant="subtitle">
                      {upperFirst(formatRelative(transaction.date, new Date()))}
                    </Row.Label>
                  </Row.Content>
                  <Row.Trailing>
                    <Row.Label color="secondary">
                      {formatCurrency(transaction.amount)}
                    </Row.Label>
                  </Row.Trailing>
                </Row.Container>
              ))}
          </Section.Content>
        </Section.Container>
      </List.Container>
    </ScrollView>
  );
});

export default Transactions;
