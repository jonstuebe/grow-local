import currency from "currency.js";
import uuid from "react-native-uuid";
import { applySnapshot, flow, onSnapshot, t } from "mobx-state-tree";
import * as SecureStore from "expo-secure-store";

import { formatCurrency } from "./utils";
import SuperJSON from "superjson";

const Transactions = t.model("Transactions", {
  id: t.identifier,
  type: t.union(t.literal("withdrawal"), t.literal("deposit")),
  amount: t.number,
  date: t.Date,
});

export const Item = t
  .model("Item", {
    id: t.identifier,
    name: t.string,
    curAmount: t.number,
    goal: t.optional(t.boolean, false),
    goalAmount: t.optional(t.union(t.number, t.undefined), undefined),
    transactions: t.array(Transactions),
  })
  .actions((self) => ({
    decrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).subtract(amount).value;
      self.transactions.push({
        id: createId(),
        type: "withdrawal",
        amount,
        date: new Date(),
      });
    },
    incrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).add(amount).value;
      self.transactions.push({
        id: createId(),
        type: "deposit",
        amount,
        date: new Date(),
      });
    },
  }))
  .views((self) => ({
    get percentSaved() {
      if (!self.goalAmount) {
        return undefined;
      }

      const perc = currency(self.curAmount).divide(self.goalAmount).value;

      return isNaN(perc) ? 0 : perc;
    },
    get formattedCurAmount() {
      return formatCurrency(self.curAmount);
    },
    get formattedGoalAmount() {
      if (!self.goalAmount) {
        return undefined;
      }

      return formatCurrency(self.goalAmount);
    },
  }));

export const SettingsStore = t.model({});

export const RootStore = t
  .model({
    items: t.map(Item),
    status: t.optional(
      t.union(t.literal("loading"), t.literal("success"), t.literal("error")),
      "loading"
    ),
    error: t.optional(t.union(t.string, t.undefined), undefined),

    settings: SettingsStore,
  })
  .actions((self) => {
    const addItem = ({
      name,
      curAmount,
      goalAmount,
    }: {
      name: string;
      curAmount: number;
      goalAmount?: number;
    }) => {
      const id = createId();
      self.items.set(
        id,
        Item.create({
          id,
          name,
          curAmount,
          goalAmount,
        })
      );
    };
    const removeItem = (id: string) => {
      self.items.delete(id);
    };
    const updateItem = (
      id: string,
      updates: Partial<{
        name: string;
        curAmount: number;
        goal?: boolean;
        goalAmount?: number;
      }>
    ) => {
      const item = self.items.get(id);

      if (item) {
        self.items.set(id, {
          id,
          name: updates.name ?? item.name,
          curAmount: updates.curAmount ?? item.curAmount,
          goal: updates.goal ?? item.goal,
          goalAmount: updates.goalAmount ?? item.goalAmount,
        });
      }
    };
    const afterCreate = flow(function* () {
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
    const removeItems = () => {
      self.items.clear();
    };

    return { afterCreate, addItem, updateItem, removeItem, removeItems };
  })
  .views((self) => ({
    get itemsTotal() {
      return Array.from(self.items.entries()).reduce((acc, [_, cur]) => {
        return currency(acc).add(cur.curAmount).value;
      }, 0);
    },
    get itemsArray() {
      return Array.from(self.items.entries());
    },
    getItemById(id: string) {
      return self.items.get(id);
    },
  }));

const createId = () => uuid.v4().toString();
export let rootStore = RootStore.create({
  items: {},
  settings: {},
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
