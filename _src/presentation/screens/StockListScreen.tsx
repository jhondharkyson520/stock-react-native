import { runMigrations } from "@/_src/data/db";
import { RootStackParamList } from "@/App";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StockRow } from "../components/StockRow";
import { useProducts } from "../hooks/useProducts";
import { useStockMovement } from "../hooks/useStockMovement";
import { Container } from "./style/container";

type StockListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockListScreen"
>;

export function StockListScreen() {
  const { stock, loading, error, handleGetHistoryStockUseStockMovement, handleDeleteHistoryStockUseStockMovement } = useStockMovement();
  const { productByBarCodeUseProducts, handleIncreaseQtdProductUseProducts} = useProducts();
  const [dbReady, setDbReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productNamesMap, setProductNamesMap] = useState<Record<string, string>>({});
  const navigation = useNavigation<StockListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
        await handleGetHistoryStockUseStockMovement();
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) handleGetHistoryStockUseStockMovement();
    });
    return unsubscribe;
  }, [dbReady, navigation]);

  useEffect(() => {
    const fetchProductNames = async () => {
      const map: Record<string, string> = {};
      for (const s of stock) {
        try {
          const p = await productByBarCodeUseProducts(s.product_id);
          map[s.product_id] = p?.name ?? "Produto excluído";
        } catch {
          map[s.product_id] = "Unknown Product";
        }
      }
      setProductNamesMap(map);
    };

    if (stock.length > 0) fetchProductNames();
  }, [stock]);

  const filteredStock = stock.filter(
    (item) =>
      (productNamesMap[item.product_id] ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date_movement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery("");

  if (!dbReady) return <Text style={styles.loadingText}>Initializing...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <Container>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar lançamentos de estoque..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredStock}
        keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
        renderItem={({ item }) => (
          <StockRow
            stock={item}
            onDelete={handleDeleteHistoryStockUseStockMovement}
            onGetProductId={productByBarCodeUseProducts}
            onUpdateProduct={handleIncreaseQtdProductUseProducts}
            productName={productNamesMap[item.product_id] ?? "Loading..."}
          />
        )}
        refreshing={loading}
        onRefresh={handleGetHistoryStockUseStockMovement}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem movimentações de estoque.</Text>}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: "#111827", fontWeight: "400" },
  clearButton: { padding: 8 },
  loadingText: { fontSize: 16, color: "#6B7280", textAlign: "center", marginTop: 20 },
  errorText: { fontSize: 16, color: "#EF4444", textAlign: "center", marginTop: 20 },
  emptyText: { fontSize: 16, color: "#6B7280", textAlign: "center", marginTop: 20 },
});
