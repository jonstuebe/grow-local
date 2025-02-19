import { z } from "zod";
import { toBool } from "../db/utils";
import { toDate } from "../db/utils";
import { centsToDollars } from "../utils";

export const item = z.object({
  id: z.string(),
  name: z.string(),
  cur_amount: z.number(),
  goal_amount: z.number().optional(),
  goal: z.boolean().optional(),
  currency: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  balance: z.number().readonly(),
});

export function fromDB(row: DBItemSchema): ItemSchema {
  return {
    id: row.id,
    name: row.name,
    cur_amount: centsToDollars(row.cur_amount),
    goal: toBool(row.goal),
    goal_amount: row.goal_amount ? centsToDollars(row.goal_amount) : undefined,
    balance: centsToDollars(row.balance),
    created_at: toDate(row.created_at),
    updated_at: toDate(row.updated_at),
  };
}

export type ItemSchema = z.infer<typeof item>;
export type DBItemSchema = Omit<
  ItemSchema,
  "goal" | "created_at" | "updated_at"
> & {
  goal: number;
  created_at: number;
  updated_at: number;
};
