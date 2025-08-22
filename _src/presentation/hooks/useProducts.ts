
import { SQLiteProductRepository } from "@/_src/data/repositories/sqliteProductRepository";
import { Product } from "@/_src/domain/models/Products";
import { CreateProductUseCase } from "@/_src/usecases/product/CreateProductUseCase";
import { DecreaseQtdProductUseCase } from "@/_src/usecases/product/DecreaseQtdProductUseCase";
import { DeleteProductsUseCase } from "@/_src/usecases/product/DeleteProductUseCase";
import { GetProductByBarCodeUseCase } from "@/_src/usecases/product/GetProductByBarCodeUseCase";
import { GetProductByIdUseCase } from "@/_src/usecases/product/GetProductByIdUseCase";
import { GetProductsUseCase } from "@/_src/usecases/product/GetProductsUseCase";
import { IncreaseQtdProductUseCase } from "@/_src/usecases/product/IncreaseQtdProductUseCase";
import { UpdateProductUseCase } from "@/_src/usecases/product/UpdateProductUseCase";
import { useCallback, useState } from "react";

const productRepository = new SQLiteProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const getProductsUseCase = new GetProductsUseCase(productRepository);
const deleteProductUseCase = new DeleteProductsUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const increaseQtdProductUseCase = new IncreaseQtdProductUseCase(productRepository);
const decreaseQtdProductUseCase = new DecreaseQtdProductUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getProductByBarCodeUseCase = new GetProductByBarCodeUseCase(productRepository)

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProductUseProducts = async (product: Omit<Product, "id">) => {
    try {
      await createProductUseCase.execute(product);
      setProducts([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  const handleGetProductsUseProducts = useCallback(async () => {
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

  const handleDeleteProductUseProducts = async (id: string) => {
    if (!id) throw new Error('Id is required to delete product');
    await deleteProductUseCase.execute(id);
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const handleEditProductUseProducts = async (product: Product) => {
    if (!product.id) throw new Error('Id is required to update product');
    await updateProductUseCase.execute(product);
  };

  const handleIncreaseQtdProductUseProducts = async (product: { code?: string; qtd?: number }) => {
    if (!product.code || !product.qtd) {
      throw new Error("Code and QTD required");
    }
    await increaseQtdProductUseCase.execute(product.code, product.qtd);
  };

  const handleDecreaseQtdProductUseProducts = async (product: { code?: string; qtd?: number }) => {
    if (!product.code || !product.qtd) {
      throw new Error("Code and QTD required");
    }
    await decreaseQtdProductUseCase.execute(product.code, product.qtd);
  };

  const productByIdUseProducts = async (id: string) => {
    if(!id) throw new Error('Id is required to find product by Id');
    return await getProductByIdUseCase.execute(id);
  }

  const productByBarCodeUseProducts = async (code: string) => {
    if(!code) throw new Error('Code is required to find product by code');
    return await getProductByBarCodeUseCase.execute(code);
  }

  const handleDumpProductsUseProducts = async () => {
    //função criada para facilitar os testes, quando for preciso da lista de produtos cadastrados no bd
    // button pronto para chamar ela: <Button title="Dump BD" onPress={handleDumpProducts} />
    try {
      await productRepository.dumpProducts();
    } catch (err) {
      console.error('Erro ao dump products:', err);
      setError("Failed to dump products");
    }
  };

  return {
    products,
    loading,
    error,
    handleCreateProductUseProducts,
    handleGetProductsUseProducts,
    handleDeleteProductUseProducts,
    handleEditProductUseProducts,
    productByIdUseProducts,
    productByBarCodeUseProducts,
    handleDumpProductsUseProducts,
    handleIncreaseQtdProductUseProducts,
    handleDecreaseQtdProductUseProducts
  };
};
