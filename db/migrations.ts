import sql, { Sql } from "sql-template-tag";
import { getDB } from "./instance";
import { query } from "./query";

type Migration = {
  up: Sql;
  down: Sql;
};

export const migrations: Migration[] = [
  {
    up: sql`
    PRAGMA foreign_keys = true;

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cur_amount INTEGER NOT NULL,
      goal_amount INTEGER,
      goal INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    ) STRICT;

    CREATE TRIGGER IF NOT EXISTS update_items_updated_at
    AFTER UPDATE ON items
    FOR EACH ROW
    BEGIN
      UPDATE items SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
    END;

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    ) STRICT;
    `,
    down: sql`
    DROP TABLE IF EXISTS transactions;
    DROP TRIGGER IF EXISTS update_items_updated_at;
    DROP TABLE IF EXISTS items;
    `,
  },
];

export async function migrate() {
  const db = getDB();

  return db.transaction(async (tx) => {
    // if migrations table doesn't exist, create it
    await query(
      tx,
      sql`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER NOT NULL,
        completed_at INTEGER NOT NULL
      ) STRICT;
  `
    );

    const result = await query<{ version: number }>(
      tx,
      sql`SELECT * FROM migrations limit 1`
    );

    const currentVersion = result.rows.length > 0 ? result.rows[0].version : 0;

    // get all migrations that are not completed
    const migrationsToRun = migrations.slice(currentVersion);

    if (migrationsToRun.length === 0) {
      console.log("No migrations to run");
      await tx.commit();
      return;
    }

    // execute all migrations that are not completed
    let migrationsRan = 0;
    for (const migration of migrationsToRun) {
      await query(tx, migration.up);
      migrationsRan++;
    }

    const newVersion = currentVersion + migrationsRan;
    await query(
      tx,
      sql`INSERT OR REPLACE INTO migrations (version, completed_at) VALUES (${newVersion}, ${Date.now()})`
    );
    await tx.commit();
    console.log("Migrations completed");
  });
}
