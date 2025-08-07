import * as SQLite from "expo-sqlite";

const DB_NAME = "app.db";
let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDB();
  const statements = [
    `PRAGMA journal_mode = WAL;`,
    `DROP TABLE products`,
    `CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
       name TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE
     );`,
    `CREATE TABLE IF NOT EXISTS products (
       id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
       name TEXT NOT NULL,
       code TEXT NOT NULL,
       description TEXT,
       value REAL NOT NULL,
       qtd INTEGER NOT NULL DEFAULT 0,
       image TEXT NOT NULL DEFAULT '',
       created_date DATE NOT NULL DEFAULT (datetime('now')),
       updated_date DATE NOT NULL DEFAULT (datetime('now'))
     );`
  ];

  for (const stmt of statements) {
    try {
      await database.execAsync(stmt);
    } catch (e) {
      console.warn("Migration statement failed:", stmt, e);
    }
  }
}

export async function ensureDbCreated(): Promise<void> {
  const database = await getDB();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS __export_check (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at INTEGER
    );
  `);
}
