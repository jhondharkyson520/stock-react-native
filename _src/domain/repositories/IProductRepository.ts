import { Product } from "../models/Products";

export interface IProductRepository {
    createProduct(product: Omit<Product, 'id'>): Promise<Product>;
}
