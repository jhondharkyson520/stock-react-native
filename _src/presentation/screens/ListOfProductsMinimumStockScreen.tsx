import { runMigrations } from "@/_src/data/db";
import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text } from "react-native";
import { ListOfProductsMinimumRow } from "../components/ListOfProductsMinimumRow";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

type ProductsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ListOfProductsMinimumStockScreen"
>;

export function ListOfProductsMinimumStockScreen() {
  const { products, loading, error, minimumStockListUseProducts, handleDeleteProductUseProducts, handleEditProductUseProducts } = useProducts();
  const [dbReady, setDbReady] = useState(false);
  const navigation = useNavigation<ProductsListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
        await minimumStockListUseProducts();
      } catch (e) {
        //console.error("Failed to initialize database:", e);
        Alert.alert('Error', 'Failed to initialize database');
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) {
        minimumStockListUseProducts();
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
            <ListOfProductsMinimumRow 
              product={item}
              onDelete={handleDeleteProductUseProducts}
            />
          )}
          refreshing={loading}
          onRefresh={minimumStockListUseProducts}
          ListEmptyComponent={<Text>Nenhum produto com quantidade menor que 3 encontrado.</Text>}
        />
    </Container>
  );
}
