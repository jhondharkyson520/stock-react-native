import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type StockRowProps = {
  stock: any;
  productName: string;
  onRevert: (movement: any) => void;
};

export function StockRow({ stock, productName, onRevert }: StockRowProps) {
  const formattedDate = new Date(stock.date_movement).toLocaleDateString("pt-BR", {
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
        <Text style={styles.detail}>Valor total: {stock.cost.toFixed(2)}</Text>
        <Text style={styles.detail}>Data: {formattedDate}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onRevert(stock)}>
        <Text style={styles.buttonText}>Cancelar movimento</Text>
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
