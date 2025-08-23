import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { runMigrations } from ".";

type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("app.db");
        await runMigrations();
        setDb(database);
      } catch (error) {
        console.error("Erro ao inicializar DB:", error);
      }
    };

    initDb();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): SQLite.SQLiteDatabase => {
  const context = useContext(DatabaseContext);
  if (!context || !context.db) {
    throw new Error("useDatabase deve ser usado dentro de um DatabaseProvider");
  }
  return context.db;
};
