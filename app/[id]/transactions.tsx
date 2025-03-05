import { useHeaderHeight } from "@react-navigation/elements";
import { formatRelative } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { upperFirst } from "lodash-es";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { ScrollView } from "react-native";

import { List } from "../../components/List";
import Row from "../../components/List/Row";
import Section from "../../components/List/Section";
import { PressableOpacity } from "../../components/PressableOpacity";
import { rootStore } from "../../state";
import { theme } from "../../theme";
import { formatCurrency, rgbaToHex } from "../../utils";

const Transactions = observer(() => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBlurEffect: "dark",
          headerTransparent: true,
          headerRight: () => (
            <PressableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                }
              }}
            >
              <SymbolView
                name="xmark.circle.fill"
                tintColor={rgbaToHex(theme.colors.fills.vibrantPrimary)}
              />
            </PressableOpacity>
          ),
          contentStyle: {
            marginTop: headerHeight,
          },
        }}
      />
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
                        {upperFirst(
                          formatRelative(transaction.date, new Date())
                        )}
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
    </>
  );
});

export default Transactions;
