import { DB, open } from "@op-engineering/op-sqlite";
import { reloadAppAsync } from "expo";

let db: DB | null = null;

const params = {
  name: "grow",
};

export const getDB = () => {
  if (!db) {
    db = open(params);
  }

  return db;
};

export const resetDB = async () => {
  const db = getDB();

  await db.transaction(async (tx) => {
    const tables = await tx.execute(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table';
    `);

    for (const table of tables.rows) {
      await tx.execute(`DROP TABLE IF EXISTS ${table.name}`);
    }
    await tx.commit();
  });

  await reloadAppAsync();
};
