import { Product } from "@/_src/domain/models/Products";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StockRowProps {
  stock: StockMovement;
  onDelete: (id: string) => void;
  productName: string;
  onGetProductId: (id: string) => Promise<Product | null>;
  onUpdateProduct: (product: { code: string; qtd: number; value: number }) => Promise<void>;
}

export function StockRow({ stock, onDelete, productName, onGetProductId, onUpdateProduct }: StockRowProps) {
  const deleteHistoryStock = async () => {
    if (!stock.id) return;
    try {      
      const product = await onGetProductId(stock.product_id);
      console.log(product);
      
      if (!product) {
        Alert.alert("Erro", "Produto não está cadastrado.");
        return;
      }

      let newQtd = product.qtd;
      let newValue = product.value;

      if(stock.type === 'entrada') {
        newQtd = product.qtd - stock.qtd;
      } else if( stock.type === 'saida') {
        newQtd = product.qtd + stock.qtd;
      }

      if(newQtd < 0) {
        Alert.alert('Error', 'A quantidade não pode ficar menor que zero após o cancelamento') 
        return;
      };

      console.log("Cancelando:", {
  atual: product.qtd,
  movimento: stock.qtd,
  tipo: stock.type,
  novo: newQtd,
});


      await onUpdateProduct({code: stock.product_id, qtd: newQtd, value: newValue});
      await onDelete(stock.id);
      Alert.alert("Success", "Stock movement deleted successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to delete stock movement");
    }
  };

  const formattedDate = new Date(stock.date_movement).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={[styles.type, stock.type === "entrada" ? styles.in : styles.out]}>{stock.type}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.detail}>Quantidade: {stock.qtd}</Text>
        <Text style={styles.detail}>Valor: ${Number(stock.cost).toFixed(2)}</Text>
        <Text style={styles.detail}>Data: {formattedDate}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteHistoryStock}>
        <Text style={styles.buttonText}>Cancelar lançamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  productName: { fontSize: 18, fontWeight: "700", color: "#111827" },
  type: { fontSize: 14, fontWeight: "600", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, color: "#FFF", textTransform: "uppercase" },
  in: { backgroundColor: "#10B981" },
  out: { backgroundColor: "#EF4444" },
  info: { marginBottom: 12 },
  detail: { fontSize: 14, color: "#4B5563", marginBottom: 4 },
  deleteButton: { backgroundColor: "#F87171", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
