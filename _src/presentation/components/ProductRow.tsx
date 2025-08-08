import { Product } from "@/_src/domain/models/Products";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { shadowStyle } from "../screens/style/shadowStyle";
import { ContainerImageProduct } from "./style/ProductFormStyle";

interface ProductRowProps {
  product: Product;
}

export function ProductRow({product}: ProductRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>id: {product.id}</Text>
        <Text style={styles.name}>Nome: {product.name}</Text>
        <Text style={styles.name}>Descrição: {product.description}</Text>
        <Text style={styles.name}>Código de barras: {product.code}</Text>
        <Text style={styles.name}>Valor: {product.value}</Text>
        <Text style={styles.name}>Quantidade: {product.qtd}</Text>
        <View style={{ marginTop: 25, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
          <ContainerImageProduct style={shadowStyle.shadow}>
            <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />                           
          </ContainerImageProduct>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});
