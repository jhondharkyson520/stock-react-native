import { SQLiteProductRepository } from "@/_src/data/repositories/sqliteProductRepository";
import { Product } from "@/_src/domain/models/Products";
import { CreateProduct } from "@/_src/domain/usecases/product/CreateProduct";
import { GetProducts } from "@/_src/domain/usecases/product/getProducts";
import { useCallback, useState } from "react";

const productRepository = new SQLiteProductRepository();
const createProductUseCase = new CreateProduct(productRepository);
const getProductsUseCase = new GetProducts(productRepository);

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProduct = async (product: Omit<Product, "id">) => {
    try {
      await createProductUseCase.execute(product);
      setProducts([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  const handleGetProducts = useCallback(async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProductsUseCase.execute();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }, []);


  return {products, loading, error, handleCreateProduct, handleGetProducts};
};
