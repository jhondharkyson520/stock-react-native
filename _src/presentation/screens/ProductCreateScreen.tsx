import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ProductForm } from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductCreateScreen() {
  const {loading, error, handleCreateProductUseProducts} = useProducts();
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
        <ProductForm onCreate={handleCreateProductUseProducts} loading={loading}/> 
    </Container>
  );
}
