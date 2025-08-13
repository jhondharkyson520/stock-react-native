import { Product } from "@/_src/domain/models/Products";
import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import { shadowStyle } from "../screens/style/shadowStyle";
import { ButtonLarge, ContainerImageProduct, LabelTextButton } from "./style/ProductFormStyle";

interface ProductRowProps {
  product: Product;
}

type ProductRowScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsListScreen"
>;


export function ProductRow({product}: ProductRowProps) {
  const {products, error, handleDeleteProduct} = useProducts();
  const navigation = useNavigation<ProductRowScreenNavigationProp>();
  const deleteProduct = async (id: string) => {
    console.log('Tentando deletar produto:', id);
    try {
      await handleDeleteProduct(id);
      Alert.alert('Product deleted success');
    } catch (err) {
      Alert.alert('Error delete product');
    }
  };

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
        <ButtonLarge 
          style={shadowStyle.shadow} 
          onPress={() => {
            if (!product.id) {
              Alert.alert("Produto inválido");
              return;
            }
            navigation.navigate("ProductEditScreen", { productId: product.id });
          }}
        >
          <LabelTextButton>Editar</LabelTextButton>
        </ButtonLarge>
        <ButtonLarge style={shadowStyle.shadow} onPress={() => product.id && deleteProduct(product.id)}>
          <LabelTextButton>Deletar</LabelTextButton>
        </ButtonLarge>       
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
