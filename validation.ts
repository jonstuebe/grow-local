import { z } from "zod";

const item = z.object({
  name: z.string().min(1).max(25),
  curAmount: z.coerce.number().min(0).default(0),
  goalAmount: z.coerce.number().min(1),
});

const amountChange = z.object({
  amount: z.coerce.number().min(0),
});

export default {
  item,
  amountChange,
};
