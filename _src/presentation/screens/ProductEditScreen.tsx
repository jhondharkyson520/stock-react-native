import { Product } from "@/_src/domain/models/Products";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ProductEdit } from "../components/ProductEdit";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductEditScreen() {
  const {handleEditProduct, productById} = useProducts();
  const route = useRoute();
  const {productId} = route.params as {productId: string};
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await productById(productId);
      if(foundProduct) setProduct(foundProduct);
    };
    fetchProduct();
  }, [productId]);

  if(!product) return <Text>Carregando</Text>;

  return (
    <Container>
        <ProductEdit
          product={product}
          onEdit={handleEditProduct}
        /> 
    </Container>
  );
}
