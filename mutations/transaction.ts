import uuid from "react-native-uuid";
import { mutate } from "../db/mutate";
import { TransactionSchema } from "../schemas/transaction";

export async function addDeposit(
  data: Omit<TransactionSchema, "id" | "created_at" | "type">
) {
  return mutate.add({
    table: "transactions",
    values: {
      ...data,
      id: uuid.v4(),
      type: "deposit",
    },
  });
}

export async function addWithdrawal(
  data: Omit<TransactionSchema, "id" | "created_at" | "type">
) {
  return mutate.add({
    table: "transactions",
    values: {
      ...data,
      id: uuid.v4(),
      type: "withdrawal",
    },
  });
}
