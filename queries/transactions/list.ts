import sql from "sql-template-tag";

import { query } from "../../db/query";
import { getDB } from "../../db";
import { DBTransactionSchema, fromDB } from "../../schemas/transaction";

export async function getTransactionsList(item_id: string) {
  const db = getDB();

  const data = await query<DBTransactionSchema>(
    db,
    sql`
    SELECT *
    FROM transactions
    WHERE item_id = ${item_id}
    ORDER BY created_at DESC
    `
  );

  return data.rows.map(fromDB);
}
