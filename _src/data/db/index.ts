import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("app.db");
  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDB();

  const statements = [
    `PRAGMA journal_mode = WAL;`,
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
       qtd INTEGER NOT NULL DEFAULT 0,
       image TEXT NOT NULL DEFAULT ''
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
