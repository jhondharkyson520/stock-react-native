import { Product } from "../models/Products";

export interface IProductRepository {
    createProduct(product: Omit<Product, 'id'>): Promise<Product>;
    getAllProducts(): Promise<Product[]>;
    getByIdProduct(id: string): Promise<Product | null>;
    updateProduct(product: Product): Promise<void>;
    deleteUser(id: string): Promise<void>;
}
