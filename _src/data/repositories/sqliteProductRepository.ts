import { Product } from "@/_src/domain/models/Products";
import { IProductRepository } from "@/_src/domain/repositories/IProductRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { getDB } from "../db";

let db:SQLiteDatabase;
(async ()=> {
    db = await getDB();
})();

export class SQLiteProductRepository implements IProductRepository {  
    async createProduct(product: Omit<Product, "id">): Promise<Product> {        
        const result = await db.runAsync(
            `INSERT INTO products (name, code, description, qtd, value, image) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                product.name, 
                product.code, 
                product.description,
                Number(product.qtd), 
                Number(product.value), 
                product.image
            ]
        );

        if (result.lastInsertRowId) {
            return { id: String(result.lastInsertRowId), ...product };
        }

        throw new Error("Failed to create product.");
    }

    async getAllProducts(): Promise<Product[]> {
       const result = await db.getAllAsync<Product>('SELECT * FROM products');
       return result
    }
    async getByIdProduct(id: string): Promise<Product | null> {
        const result = await db.getFirstAsync<Product>('SELECT * FROM products WHERE id=?', [id]);
        return result;
    }
    async updateProduct(product: Product): Promise<void> {
        await db.runAsync(`UPDATE products SET name = ?, code = ?, description = ?, qtd = ?, value = ?, image = ? WHERE id = ?`,
            [
                product.name, 
                product.code, 
                product.description,
                Number(product.qtd), 
                Number(product.value), 
                product.image
            ]
        );
    }
    async deleteProduct(id: string): Promise<void> {
        await db.runAsync("DELETE FROM products WHERE id=?", [id]);
    }
}
