import sql from "sql-template-tag";
import { getDB } from "../../db";
import { query } from "../../db/query";
import { DBItemSchema, fromDB, ItemSchema } from "../../schemas/item";

export async function getItem(id: string): Promise<ItemSchema> {
  const data = await query<DBItemSchema>(
    getDB(),
    sql`SELECT * FROM items WHERE id = ${id} LIMIT 1`
  );

  return fromDB(data.rows[0]);
}
