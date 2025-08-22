import { Product } from "@/_src/domain/models/Products";
import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { shadowStyle } from "../screens/style/shadowStyle";
import { ButtonLarge, ContainerImageProduct, LabelTextButton } from "./style/ProductFormStyle";

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
}

type ProductRowScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsListScreen"
>;


export function ProductRow({product, onDelete}: ProductRowProps) {
  const navigation = useNavigation<ProductRowScreenNavigationProp>();

  const deleteProduct = async () => {
    if(!product.id) return;
    try {
      await onDelete(product.id);
      Alert.alert('Success', 'Product deleted success');
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Falha ao deletar produto");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={{ marginTop: 25, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
          <ContainerImageProduct style={shadowStyle.shadow}>
            {product.image == 'blank' ? <></> : <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />}                          
          </ContainerImageProduct>
        </View>
        <Text style={styles.name}>Nome: {product.name}</Text>
        {product.description ? <Text style={styles.name}>Descrição: {product.description}</Text> : <></>}
        <Text style={styles.name}>Valor: {product.value}</Text>
        <Text style={styles.name}>Quantidade: {product.qtd}</Text>
        
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
        <ButtonLarge style={shadowStyle.shadow} onPress={deleteProduct}>
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
