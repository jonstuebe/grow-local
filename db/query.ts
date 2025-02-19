import { Sql } from "sql-template-tag";
import { getDB } from "./instance";
import {
  Scalar,
  QueryResult,
  DB,
  Transaction,
} from "@op-engineering/op-sqlite";

export function query<T>(
  db: DB | Transaction,
  sql: Sql
): Promise<Omit<QueryResult, "rows"> & { rows: T[] }> {
  return db.execute(sql.sql, sql.values as Scalar[]) as Promise<
    Omit<QueryResult, "rows"> & { rows: T[] }
  >;
}

export function reactiveQuery<T>(
  sql: Sql,
  fireOn: { table: string; ids?: number[] }[],
  callback: (response: Omit<QueryResult, "rows"> & { rows: T[] }) => void
): () => void {
  const db = getDB();

  db.execute(sql.sql, sql.values as Scalar[]).then((r) => {
    callback(r as Omit<QueryResult, "rows"> & { rows: T[] });
  });

  return db.reactiveExecute({
    query: sql.sql,
    arguments: sql.values as Scalar[],
    fireOn,
    callback,
  });
}
