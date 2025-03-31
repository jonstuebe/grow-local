import { formatRelative } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { upperFirst } from "lodash-es";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { ActionSheetIOS } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  PressableOpacity,
  RowContainer,
  RowContent,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
} from "react-native-orchard";

import { rootStore } from "../../state";
import { formatCurrency } from "../../utils";

const Transactions = observer(() => {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const item = computed(() => rootStore.getItemById(id)).get();

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <SheetHeaderContainer>
        <PressableOpacity
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                cancelButtonIndex: 0,
                destructiveButtonIndex: 1,
                title: "Are you sure?",
                message: "This action cannot be undone.",
                options: ["Cancel", "Undo Last Transaction"],
              },
              (buttonIndex) => {
                if (buttonIndex === 1) {
                  item?.removeLastTransaction();
                }
              }
            );
          }}
        >
          <SymbolView name="arrow.uturn.backward.circle.fill" size={30} />
        </PressableOpacity>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <ListContainer>
        <SectionContainer>
          <SectionContent>
            {item?.transactions
              .slice()
              .reverse()
              .map((transaction, idx) => (
                <RowContainer key={idx}>
                  <RowContent>
                    <RowLabel>{upperFirst(transaction.type)}</RowLabel>
                    <RowLabel variant="subtitle">
                      {upperFirst(formatRelative(transaction.date, new Date()))}
                    </RowLabel>
                  </RowContent>
                  <RowTrailing>
                    <RowLabel color="secondary">
                      {formatCurrency(transaction.amount)}
                    </RowLabel>
                  </RowTrailing>
                </RowContainer>
              ))}
          </SectionContent>
        </SectionContainer>
      </ListContainer>
    </ScrollView>
  );
});

export default Transactions;
