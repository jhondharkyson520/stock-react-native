import React from "react";
import { ProductForm } from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductCreateScreen() {
  const {loading, error, handleCreateProductUseProducts} = useProducts();
  return (
    <Container>
        <ProductForm onCreate={handleCreateProductUseProducts} loading={loading}/> 
    </Container>
  );
}
