import currency from "currency.js";
import uuid from "react-native-uuid";
import { applySnapshot, flow, onSnapshot, t } from "mobx-state-tree";
import * as SecureStore from "expo-secure-store";

import { formatCurrency } from "./utils";
import SuperJSON from "superjson";

export const Item = t
  .model("Item", {
    id: t.identifier,
    name: t.string,
    curAmount: t.number,
    goalAmount: t.number,
  })
  .actions((self) => ({
    updateCurAmount(amount: number) {
      self.curAmount = amount;
    },
    updateGoalAmount(amount: number) {
      self.goalAmount = amount;
    },
    decrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).subtract(amount).value;
    },
    incrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).add(amount).value;
    },
  }))
  .views((self) => ({
    get percentSaved() {
      return currency(self.curAmount).divide(self.goalAmount).value;
    },
    get formattedCurAmount() {
      return formatCurrency(self.curAmount);
    },
    get formattedGoalAmount() {
      return formatCurrency(self.goalAmount);
    },
  }));

export const RootStore = t
  .model({
    items: t.array(Item),
    status: t.optional(
      t.union(t.literal("loading"), t.literal("success"), t.literal("error")),
      "loading"
    ),
    error: t.optional(t.union(t.string, t.undefined), undefined),
  })
  .actions((self) => {
    const addItem = ({
      name,
      curAmount,
      goalAmount,
    }: {
      name: string;
      curAmount: number;
      goalAmount: number;
    }) => {
      self.items.push(
        Item.create({
          id: createId(),
          name,
          curAmount,
          goalAmount,
        })
      );
    };
    const getItems = flow(function* () {
      self.status = "loading";

      try {
        const items = yield SecureStore.getItemAsync("items");
        if (items) {
          applySnapshot(rootStore.items, SuperJSON.parse(items));
        }
        self.status = "success";
      } catch (e: any) {
        self.status = "error";
        self.error = e.message;
      }
    });

    return { addItem, getItems };
  })
  .views((self) => ({
    get itemsTotal() {
      return self.items.reduce((acc, cur) => {
        return currency(acc).add(cur.curAmount).value;
      }, 0);
    },
    get itemsTotalFormatted() {
      return formatCurrency(
        self.items.reduce((acc, cur) => {
          return currency(acc).add(cur.curAmount).value;
        }, 0)
      );
    },
    getItemById(id: string) {
      return self.items.find((item) => item.id === id);
    },
  }));

const createId = () => uuid.v4().toString();
export let rootStore = RootStore.create({
  items: [],
});

onSnapshot(rootStore, async (snapshot) => {
  try {
    await SecureStore.setItemAsync(
      "items",
      SuperJSON.stringify(snapshot.items)
    );
  } catch {
    //
  }
});
