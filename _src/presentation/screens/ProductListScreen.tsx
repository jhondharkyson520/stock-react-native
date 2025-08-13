import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { ProductRow } from "../components/ProductRow";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductsListScreen() {
  const {products, loading, error, handleGetProducts} = useProducts();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
         if (dbReady) {
          handleGetProducts();
        }
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, [dbReady]);

  return (
    <Container>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
          renderItem={({ item }) => <ProductRow product={item} />}
          refreshing={loading}
          onRefresh={handleGetProducts}
          ListEmptyComponent={<Text>Nenhum usuário encontrado.</Text>}
        />
    </Container>
  );
}
