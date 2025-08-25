import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { runMigrations } from ".";

type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);

    useEffect(() => {
      const initDb = async () => {
        try {
          const database = await SQLite.openDatabaseAsync("app.db");
          await runMigrations();
          setDb(database);
          setReady(true);
        } catch (error) {
          console.error("Erro ao inicializar DB:", error);
        }
      };
      initDb();
    }, []);

  if (!ready) return <Text>Inicializando banco de dados...</Text>;

  return (
    <DatabaseContext.Provider value={{ db: db }}>
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
