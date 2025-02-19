import { z } from "zod";

const item = z
  .object({
    name: z.string().min(1).max(25),
    curAmount: z.coerce.number().min(0).default(0),
    goal: z.boolean().default(false),
    goalAmount: z.coerce.number().optional(),
  })
  .refine(({ goal, goalAmount }) => {
    if (goal === true) {
      if (goalAmount === undefined) {
        return false;
      }
      if (goalAmount < 1) {
        return false;
      }
    }

    return true;
  });

const amountChange = z.object({
  amount: z.coerce.number().min(1),
});

export function stringAsNumber() {
  return z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined) {
        return val;
      }

      const num = parseFloat(val);

      if (isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid number",
        });
      }

      if (num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number must be positive",
        });
      }

      return num;
    });
}

export default {
  item,
  amountChange,
};
