import { runMigrations } from "@/_src/data/db";
import React, { useEffect, useState } from "react";
import { ProductEdit } from "../components/ProductEdit";
import { useProducts } from "../hooks/useProducts";
import { Container } from "./style/container";

export function ProductEditScreen() {
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
        <ProductEdit/> 
    </Container>
  );
}
