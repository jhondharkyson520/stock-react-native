import { SQLiteProductRepository } from "@/_src/data/repositories/sqliteProductRepository";
import { Product } from "@/_src/domain/models/Products";
import { CreateProduct } from "@/_src/domain/usecases/product/CreateProduct";
import { useState } from "react";

const productRepository = new SQLiteProductRepository();
const createProductUseCase = new CreateProduct(productRepository);

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
   const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (product: Omit<Product, "id">) => {
    try {
      await createProductUseCase.execute(product);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };


  return { products, error, handleCreateUser};
};
