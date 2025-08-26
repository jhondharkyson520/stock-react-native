import { Product } from "../models/Products";

export interface IProductRepository {
    createProduct(product: Product): Promise<Product>;
    getAllProducts(): Promise<Product[]>;
    getByIdProduct(id: string): Promise<Product | null>;
    getByBarCodeProduct(code: string): Promise<Product | null>;
    updateProduct(product: Product): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    findByCode(code: string): Promise<Product | null>;
    updateQuantity(code: string, qtd: number): Promise<void>;

    listOfProductsOfQtdMinimumInStock(): Promise<Product[]>;
    totalStockValueAndQuantity(): Promise<{ total_quantity: number; total_value: number }>;
}
