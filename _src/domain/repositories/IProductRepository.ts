import { Product } from "../models/Products";

export interface IProductRepository {
    createProduct(product: Omit<Product, 'id'>): Promise<Product>;
    getAllProducts(): Promise<Product[]>;
    getByIdProduct(id: string): Promise<Product | null>;
    getByBarCodeProduct(code: string): Promise<Product | null>;
    updateProduct(product: Product): Promise<void>;
    increaseQtdProduct(product: Partial<Product>): Promise<void>;
    decreaseQtdProduct(product: Partial<Product>): Promise<void>;
    deleteProduct(id: string): Promise<void>;
}
