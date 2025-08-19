import { runMigrations } from "@/_src/data/db";
import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { StockRow } from "../components/StockRow";
import { useStockMovement } from "../hooks/useStockMovement";
import { Container } from "./style/container";

type StockListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockListScreen"
>;

export function StockListScreen() {
  const { stock, loading, error, handleGetHistoryStock } = useStockMovement();
  const [dbReady, setDbReady] = useState(false);
  const navigation = useNavigation<StockListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
        await handleGetHistoryStock();
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) {
        handleGetHistoryStock();
      }
    });
    return unsubscribe;
  }, [dbReady, navigation]);

  if (!dbReady) return <Text>Inicializando...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <Container>
        <FlatList
          data={stock}
          keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
          renderItem={({ item }) => (
            <StockRow 
              stock={item}
              //onDelete={handleDeleteProduct}
            />
          )}
          refreshing={loading}
          //onRefresh={handleGetProducts}
          ListEmptyComponent={<Text>Nenhuma movimentação encontrada.</Text>}
        />
    </Container>
  );
}
