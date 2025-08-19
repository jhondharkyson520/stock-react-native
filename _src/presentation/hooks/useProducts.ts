
import { SQLiteProductRepository } from "@/_src/data/repositories/sqliteProductRepository";
import { Product } from "@/_src/domain/models/Products";
import { CreateProduct } from "@/_src/domain/usecases/product/CreateProduct";
import { DeleteProducts } from "@/_src/domain/usecases/product/DeleteProduct";
import { GetProductById } from "@/_src/domain/usecases/product/GetProductById";
import { GetProducts } from "@/_src/domain/usecases/product/GetProducts";
import { UpdateProduct } from "@/_src/domain/usecases/product/UpdateProduct";
import { useCallback, useState } from "react";

const productRepository = new SQLiteProductRepository();
const createProductUseCase = new CreateProduct(productRepository);
const getProductsUseCase = new GetProducts(productRepository);
const deleteProductUseCase = new DeleteProducts(productRepository);
const updateProductUseCase = new UpdateProduct(productRepository);
const getProductById = new GetProductById(productRepository)

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
    
    const handleDeleteProduct = async (id: string) => {
      try {
        await deleteProductUseCase.execute(id);
        setProducts(prev => prev.filter(product => product.id !== id)); 
      } catch (err) {
        console.error(err);
        setError("Failed to delete product");
      }
    };

    const handleEditProduct = async (product: Product) => {
      try {
        await updateProductUseCase.execute(product);
      } catch (err) {
        console.error(err);
        setError("Failed to update product");
      }
    };
    
    const productById = async (id: string) => {
      try {
        const product = await getProductById.execute(id);
        return product;
      } catch (err) {
        setError("Failed load info of product");
        return null;
      }
    }


  return {products, loading, error, handleCreateProduct, handleGetProducts, handleDeleteProduct, handleEditProduct, productById};
};
