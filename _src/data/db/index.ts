import * as FileSystem from 'expo-file-system';
import * as SQLite from "expo-sqlite";

const DB_NAME = "app.db";
let db: SQLite.SQLiteDatabase | null = null;

const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export async function resetDatabase() {
  try {
    await FileSystem.deleteAsync(DB_PATH, { idempotent: true });
    console.log("Database deleted!");
  } catch (error) {
    console.error("Error deleting database:", error);
  }
}

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDB();
  const statements = [
    `PRAGMA journal_mode = WAL;`,
    `CREATE TABLE IF NOT EXISTS products (
       id TEXT PRIMARY KEY NOT NULL,
       name TEXT NOT NULL,
       code TEXT NOT NULL,
       description TEXT,
       value REAL NOT NULL,
       qtd INTEGER NOT NULL DEFAULT 0,
       image TEXT NOT NULL DEFAULT '',
       created_date DATE NOT NULL DEFAULT (datetime('now')),
       updated_date DATE NOT NULL DEFAULT (datetime('now'))
     );`,
     `CREATE TABLE IF NOT EXISTS stock_movements (
       id TEXT PRIMARY KEY NOT NULL,
       product_id TEXT NOT NULL,
       type TEXT NOT NULL CHECK(type IN ('entrada', 'saida')),
       qtd INTEGER NOT NULL,
       cost REAL NOT NULL,
       date_movement DATE NOT NULL,
       FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
     );`,
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
