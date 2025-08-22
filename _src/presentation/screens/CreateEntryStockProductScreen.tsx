import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { CreateEntryStockForm } from "../components/CreateEntryStockForm";
import { useStockMovement } from "../hooks/useStockMovement";
import { Container } from "./style/container";

export function CreateEntryStockProductScreen() {
  const {loading, error, handleCreateStockUseStockMovement} = useStockMovement();
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
      } catch (e) {
        console.error("Failed to initialize database:", e);
        setDbError('Erro ao inicializar o banco de dados');
      }
    };
    initializeDb();
  }, []);

  if(dbError) return <Text>{dbError}</Text>;
  if(!dbReady) return <Text>Inicializando...</Text>;

  return (
    <Container>
        <CreateEntryStockForm onCreate={handleCreateStockUseStockMovement} loading={loading}/>
    </Container>
  );
}
