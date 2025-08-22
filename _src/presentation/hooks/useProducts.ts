
import { SQLiteProductRepository } from "@/_src/data/repositories/sqliteProductRepository";
import { Product } from "@/_src/domain/models/Products";
import { CreateProductUseCase } from "@/_src/domain/usecases/product/CreateProductUseCase";
import { DecreaseQtdProductUseCase } from "@/_src/domain/usecases/product/DecreaseQtdProductUseCase";
import { DeleteProductsUseCase } from "@/_src/domain/usecases/product/DeleteProductUseCase";
import { GetProductByBarCode } from "@/_src/domain/usecases/product/GetProductByBarCode";
import { GetProductById } from "@/_src/domain/usecases/product/GetProductById";
import { GetProducts } from "@/_src/domain/usecases/product/GetProducts";
import { IncreaseQtdProductUseCase } from "@/_src/domain/usecases/product/IncreaseQtdProductUseCase";
import { UpdateProductUseCase } from "@/_src/domain/usecases/product/UpdateProductUseCase";
import { useCallback, useState } from "react";

const productRepository = new SQLiteProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const getProductsUseCase = new GetProducts(productRepository);
const deleteProductUseCase = new DeleteProductsUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const increaseQtdProductUseCase = new IncreaseQtdProductUseCase(productRepository);
const decreaseQtdProductUseCase = new DecreaseQtdProductUseCase(productRepository);
const getProductById = new GetProductById(productRepository);
const getProductByBarCode = new GetProductByBarCode(productRepository)

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
      if(!id) throw new Error('Id is required to delete product');    
      await deleteProductUseCase.execute(id);
      setProducts(prev => prev.filter(product => product.id !== id));      
    };

    const handleEditProduct = async (product: Product) => {
      if(!product.id) throw new Error('Id is required to update product');
      await updateProductUseCase.execute(product);      
    };

    const handleIncreaseQtdProduct = async (product: { code?: string; qtd?: number }) => {
      if (!product.code || !product.qtd) {
          throw new Error("Code and QTD required");
      }
      await increaseQtdProductUseCase.execute(product.code, product.qtd);
    };

    const handleDecreaseQtdProduct = async (product: { code?: string; qtd?: number }) => {
        if (!product.code || !product.qtd) {
          throw new Error("Code and QTD required");
        }
        await decreaseQtdProductUseCase.execute(product.code, product.qtd);
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

    const productByBarCode = async (code: string) => {
      try {
        const product = await getProductByBarCode.execute(code);
        return product;
      } catch (err) {
        //console.error('Erro ao buscar por barcode:', err);
        setError("Failed to load product by barcode");
        return null;
      }
    }

    const handleDumpProducts = async () => {
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
    handleCreateProduct, 
    handleGetProducts, 
    handleDeleteProduct, 
    handleEditProduct, 
    productById, 
    productByBarCode, 
    handleDumpProducts, 
    handleIncreaseQtdProduct,
    handleDecreaseQtdProduct
  };
};
