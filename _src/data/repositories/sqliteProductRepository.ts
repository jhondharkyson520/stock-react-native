import { Product } from "@/_src/domain/models/Products";
import { IProductRepository } from "@/_src/domain/repositories/IProductRepository";
import { getDB } from "../db";

export class SQLiteProductRepository implements IProductRepository {
    async createProduct(product: Omit<Product, "id">): Promise<Product> {
        const db = await getDB();
        const result = await db.runAsync(
            "INSERT INTO products (name, code, description, qtd, value, image) VALUES (?, ?, ?, ?, ?, ?)",
            [product.name, product.code, product.description, Number(product.qtd), Number(product.value), product.image]
        );

        if (result.lastInsertRowId) {
            return { id: String(result.lastInsertRowId), ...product };
        }

        throw new Error("Failed to create product.");
    }
}
