import { z } from "zod";
import { toDate } from "../db/utils";
import { centsToDollars } from "../utils";

export const transactionType = z.enum(["deposit", "withdrawal"]);
export const transaction = z.object({
  id: z.string(),
  amount: z.number(),
  type: transactionType,
  item_id: z.string(),
  created_at: z.date(),
});

export function fromDB(row: DBTransactionSchema): TransactionSchema {
  return {
    ...row,
    created_at: toDate(row.created_at),
    amount: centsToDollars(row.amount),
  };
}

export type TransactionSchema = z.infer<typeof transaction>;
export type DBTransactionSchema = Omit<TransactionSchema, "created_at"> & {
  created_at: number;
};
