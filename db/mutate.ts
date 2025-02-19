import sql, { join, raw, Sql } from "sql-template-tag";
import { getDB } from "./instance";
import { query } from "./query";

async function add<TValues extends Record<string, any>>({
  table,
  values,
}: {
  table: string;
  values: TValues;
}) {
  const db = getDB();

  const columns = join(Object.keys(values).map(raw));
  const valuesClause = join(Object.values(values));

  return db.transaction(async (tx) => {
    await query(
      tx,
      sql`INSERT INTO ${raw(table)} (${columns}) VALUES (${valuesClause})`
    );
    await tx.commit();
  });
}

async function update<TUpdates extends Record<string, any>>({
  table,
  updates,
  where,
}: {
  table: string;
  updates: TUpdates;
  where: Record<string, any>;
}) {
  const db = getDB();

  const assignments = join(
    Object.entries(updates).map(([key, value]) => sql`${raw(key)} = ${value}`)
  );

  const whereClause = join(
    Object.entries(where).map(([key, value]) => sql`${raw(key)} = ${value}`)
  );

  const sqlQuery = sql`UPDATE ${raw(
    table
  )} SET ${assignments} WHERE ${whereClause}`;

  return db.transaction(async (tx) => {
    await query(tx, sqlQuery);
    await tx.commit();
  });
}

async function remove({
  table,
  where,
  relatedQuery,
}: {
  table: string;
  where: Record<string, any>;
  relatedQuery?: Sql;
}) {
  const db = getDB();

  const whereClause = join(
    Object.entries(where).map(([key, value]) => sql`${raw(key)} = ${value}`)
  );

  const sqlQuery = sql`DELETE FROM ${raw(table)} WHERE ${whereClause}`;

  return db.transaction(async (tx) => {
    await query(tx, sqlQuery);
    if (relatedQuery) {
      await query(tx, relatedQuery);
    }
    await tx.commit();
  });
}

export const mutate = {
  add,
  remove,
  update,
};
