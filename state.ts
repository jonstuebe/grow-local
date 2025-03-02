import currency from "currency.js";
import * as SecureStore from "expo-secure-store";
import {
  applySnapshot,
  flow,
  ModelSnapshotType,
  onSnapshot,
  t,
} from "mobx-state-tree";
import uuid from "react-native-uuid";
import SuperJSON from "superjson";

import { getData, saveData } from "./data";
import { formatCurrency } from "./utils";

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

export const RootStore = t
  .model({
    items: t.map(Item),
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
      goalAmount?: number;
    }) => {
      const id = createId();
      self.items.set(
        id,
        Item.create({
          id,
          name,
          curAmount,
          goal: goalAmount === undefined ? false : true,
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
          goalAmount:
            updates.goal === false
              ? undefined
              : updates.goalAmount ?? item.goalAmount,
        });
      }
    };
    const afterCreate = flow(function* () {
      self.status = "loading";

      try {
        // old versions that are running on secure store data
        const items = yield SecureStore.getItemAsync("items");
        if (items) {
          saveData(SuperJSON.parse(items));
          applySnapshot(rootStore.items, SuperJSON.parse(items));

          // remove the old data from secure store
          // as we are using the new file system data from now on
          yield SecureStore.deleteItemAsync("items");
        } else {
          // new versions that are running on file system data
          const data = getData();
          if (data) {
            applySnapshot(rootStore.items, data);
          }
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

    const transfer = (fromId: string, toId: string, amount: number) => {
      const fromItem = self.items.get(fromId);
      const toItem = self.items.get(toId);

      if (fromItem && toItem) {
        fromItem.decrementBy(amount);
        toItem.incrementBy(amount);
      }
    };

    const restore = (data: ModelSnapshotType<any>) => {
      applySnapshot(rootStore.items, data);
    };

    return {
      afterCreate,
      addItem,
      updateItem,
      removeItem,
      removeItems,
      transfer,
      restore,
    };
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
});

onSnapshot(rootStore, async (snapshot) => {
  try {
    saveData(snapshot.items);
  } catch (e) {
    console.log(e);
  }
});
