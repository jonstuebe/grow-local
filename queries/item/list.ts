import sql from "sql-template-tag";
import { reactiveQuery } from "../../db/query";
import { DBItemSchema, fromDB, ItemSchema } from "../../schemas/item";

export function getItemsList(
  callback: (items: ItemSchema[]) => void
): () => void {
  return reactiveQuery<DBItemSchema>(
    sql`
    SELECT 
      i.*,
      i.cur_amount + COALESCE(b.balance, 0) AS balance
    FROM 
      items i
    LEFT JOIN (
      SELECT 
        item_id,
        SUM(CASE 
          WHEN type = 'deposit' THEN amount 
          WHEN type = 'withdrawal' THEN -amount 
          ELSE 0 
        END) AS balance
      FROM transactions
      GROUP BY item_id
    ) b ON i.id = b.item_id;
  `,
    [{ table: "items" }, { table: "transactions" }],
    (response) => {
      callback(response.rows.map(fromDB));
    }
  );
}
