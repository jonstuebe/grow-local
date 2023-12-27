import currency from "currency.js";
import uuid from "react-native-uuid";
import {
  addMiddleware,
  applySnapshot,
  flow,
  onSnapshot,
  t,
} from "mobx-state-tree";
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
    decrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).subtract(amount).value;
    },
    incrementBy(amount: number) {
      self.curAmount = currency(self.curAmount).add(amount).value;
    },
  }))
  .views((self) => ({
    get percentSaved() {
      const perc = currency(self.curAmount).divide(self.goalAmount).value;

      return isNaN(perc) ? 0 : perc;
    },
    get formattedCurAmount() {
      return formatCurrency(self.curAmount);
    },
    get formattedGoalAmount() {
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
      goalAmount: number;
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
      updates: Partial<{ name: string; curAmount: number; goalAmount: number }>
    ) => {
      const item = self.items.get(id);

      if (item) {
        self.items.set(id, {
          id,
          name: updates.name ?? item.name,
          curAmount: updates.curAmount ?? item.curAmount,
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
