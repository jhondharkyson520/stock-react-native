import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { ProductForm } from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductScreen() {
  const {products, loading, error, handleCreateProduct} = useProducts();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await runMigrations();
        setDbReady(true);
      } catch (e) {
        console.error("Failed to initialize database:", e);
      }
    };
    initializeDb();
  }, []);

  return (
    <Container>
        <ProductForm/>    
    </Container>
  );
}
