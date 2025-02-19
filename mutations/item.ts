import uuid from "react-native-uuid";
import { mutate } from "../db/mutate";
import { fromBool } from "../db/utils";
import { ItemSchema } from "../schemas/item";
import sql from "sql-template-tag";

export async function addItem(
  data: Omit<ItemSchema, "id" | "created_at" | "updated_at" | "balance">
) {
  return mutate.add({
    table: "items",
    values: {
      ...data,
      id: uuid.v4(),
      goal: fromBool(data.goal ?? false),
      goal_amount: data.goal ? data.goal_amount : undefined,
    },
  });
}

export async function removeItem(id: string) {
  return mutate.remove({
    table: "items",
    where: { id },
    relatedQuery: sql`DELETE FROM transactions WHERE item_id = ${id}`,
  });
}

export async function updateItem(
  id: string,
  updates: Partial<Omit<ItemSchema, "id" | "created_at" | "updated_at">>
) {
  return mutate.update({
    table: "items",
    updates,
    where: {
      id,
    },
  });
}
