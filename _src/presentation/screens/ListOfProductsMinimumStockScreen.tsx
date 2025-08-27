import { runMigrations } from "@/_src/data/db";
import { RootStackParamList } from "@/App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProducts } from "../hooks/useProducts";

type ProductsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ListOfProductsMinimumStockScreen"
>;

const STORAGE_KEY = "@checkedItems";

export function ListOfProductsMinimumStockScreen() {
  const { products, loading, error, minimumStockListUseProducts } = useProducts();
  const [dbReady, setDbReady] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const navigation = useNavigation<ProductsListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
        await minimumStockListUseProducts();
        await loadCheckedItems();
      } catch (e) {
        Alert.alert('Erro', 'Falha ao inicializar o banco de dados');
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) minimumStockListUseProducts();
    });
    return unsubscribe;
  }, [dbReady, navigation]);

  const loadCheckedItems = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch (e) {
      console.log("Erro ao carregar itens marcados:", e);
    }
  };

  const saveCheckedItems = async (newCheckedItems: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCheckedItems));
    } catch (e) {
      console.log("Erro ao salvar itens marcados:", e);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      saveCheckedItems(updated);
      return updated;
    });
  };

  if (!dbReady) return <View style={styles.center}><ActivityIndicator size="large" color="#1a73e8" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  const renderChecklistItem = (item: any) => {
    const isLowStock = item.quantity < 3;
    const checked = checkedItems[item.id] || false;

    const formattedDate = new Date(item.updated_date).toLocaleDateString("pt-BR", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });   

    return (
      <TouchableOpacity onPress={() => toggleCheck(item.id)} style={[styles.ticket, isLowStock && styles.lowStockTicket]}>
        <View style={styles.row}>
          <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
            {checked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={[styles.info, checked && styles.disabledInfo]}>
            <Text style={[styles.productName, checked && styles.lineThrough]}>{item.name}</Text>
            <Text style={[styles.productDetail, checked && styles.lineThrough]}>Quantidade em estoque: {item.qtd}</Text>
            <Text style={[styles.productDetail, checked && styles.lineThrough]}>Última movimentação: {formattedDate ?? 'Nunca'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras - Estoque Mínimo</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
        renderItem={({ item }) => renderChecklistItem(item)}
        refreshing={loading}
        onRefresh={minimumStockListUseProducts}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum produto com quantidade menor que 3 encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a73e8", marginBottom: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontWeight: "bold" },
  empty: { marginTop: 50, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#888" },

  ticket: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lowStockTicket: {
    borderLeftWidth: 5,
    borderLeftColor: "#ea4335",
  },
  row: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: "#1a73e8",
  },
  checkmark: { color: "#fff", fontWeight: "bold" },
  info: { flex: 1 },
  disabledInfo: { opacity: 0.5 },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productDetail: { fontSize: 14, color: "#555" },
  lineThrough: { textDecorationLine: "line-through" },
});
