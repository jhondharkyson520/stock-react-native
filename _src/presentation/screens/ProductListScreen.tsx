import { RootStackParamList } from "@/App";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ProductRow } from "../components/ProductRow";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

type ProductsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsListScreen"
>;

export function ProductsListScreen() {
  const { products, loading, error, handleGetProductsUseProducts, handleDeleteProductUseProducts } = useProducts();
  const [dbReady, setDbReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<ProductsListScreenNavigationProp>();

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await handleGetProductsUseProducts();        
        setDbReady(true);
      } catch (e) {
        Alert.alert("Error", "Failed to initialize database");
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (dbReady) {
        handleGetProductsUseProducts();
      }
    });
    return unsubscribe;
  }, [dbReady, navigation]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (!dbReady) return <Text style={styles.loadingText}>Initializing...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <Container>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar produtos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Procurar produtos"
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
        data={filteredProducts}
        keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            onDelete={handleDeleteProductUseProducts}
          />
        )}
        refreshing={loading}
        onRefresh={handleGetProductsUseProducts}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#111827",
    fontWeight: "400",
  },
  clearButton: {
    padding: 8,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
});