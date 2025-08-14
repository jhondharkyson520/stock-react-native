import { runMigrations } from "@/_src/data/db";
import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { ProductRow } from "../components/ProductRow";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

type ProductsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsListScreen"
>;

export function ProductsListScreen() {
  const { products, loading, error, handleGetProducts, handleDeleteProduct, handleEditProduct } = useProducts();
  const [dbReady, setDbReady] = useState(false);
  const navigation = useNavigation<ProductsListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
        await handleGetProducts();
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) {
        handleGetProducts();
      }
    });
    return unsubscribe;
  }, [dbReady, navigation]);

  if (!dbReady) return <Text>Inicializando...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <Container>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
          renderItem={({ item }) => (
            <ProductRow 
              product={item}
              onDelete={handleDeleteProduct}
            />
          )}
          refreshing={loading}
          onRefresh={handleGetProducts}
          ListEmptyComponent={<Text>Nenhum usuário encontrado.</Text>}
        />
    </Container>
  );
}
