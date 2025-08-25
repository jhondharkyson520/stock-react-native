import { Product } from "@/_src/domain/models/Products";
import { IProductRepository } from "@/_src/domain/repositories/IProductRepository";
import { SQLiteDatabase } from "expo-sqlite";

export class SQLiteProductRepository implements IProductRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        if (!db) {
        throw new Error("DB não pode ser nulo");
        }
        this.db = db;
    }
    async createProduct(product: Omit<Product, "id">): Promise<Product> {
        const result = await this.db.runAsync(
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
        const result = await this.db.getAllAsync<Product>('SELECT * FROM products');
        return result;
    }
  
    async getByBarCodeProduct(code: string): Promise<Product | null> {        
            const result = await this.db.getFirstAsync<Product>('SELECT * FROM products WHERE code=?', [code]);
            return result ? (result as Product) : null;          
    }

    async dumpProducts(): Promise<Product[]> {
        try {
            const allProducts = await this.db.getAllAsync<Product>('SELECT * FROM products');
            console.log('Dump completo da tabela products:', allProducts);
            return allProducts;
        } catch (err) {
            console.error('Erro no dump:', err);
            return [];
        }
    }

    async updateProduct(product: Product): Promise<void> {      
        if(product.id){
            await this.db.runAsync(`UPDATE products SET name = ?, code = ?, description = ?, qtd = ?, value = ?, image = ? WHERE id = ?`,
                [
                    product.name,
                    product.code,
                    product.description,
                    Number(product.qtd),
                    Number(product.value),
                    product.image,
                    product.id
                ]
            );
        }        
    }
    
    async getByIdProduct(id: string): Promise<Product | null> {
        const result = await this.db.getFirstAsync<Product>('SELECT * FROM products WHERE id=?', [id]);
        return result ? (result as Product) : null;
    }

    async findByCode(code: string): Promise<Product | null> {
        const result = await this.db.getFirstAsync("SELECT * FROM products WHERE code = ?", [code]);
        return result ? (result as Product) : null;
    }

    async updateQuantity(code: string, qtd: number): Promise<void> {
        await this.db.runAsync("UPDATE products SET qtd = ? WHERE code = ?", [qtd, code]);
    }

    async deleteProduct(id: string): Promise<void> {
        await this.db.runAsync("DELETE FROM products WHERE id=?", [id]);
    }

    async listOfProductsOfQtdMinimumInStock(): Promise<Product[]> {
        const result = await this.db.getAllAsync<Product>("SELECT * FROM products WHERE qtd < 3");
        return result;
    }

    async totalStockValueAndQuantity(): Promise<{ total_quantity: number; total_value: number }> {
        const result = await this.db.getFirstAsync<{ total_quantity: number; total_value: number }>(
        `SELECT SUM(qtd) AS total_quantity, SUM(qtd*value) AS total_value FROM products`
        );
        return { total_quantity: result?.total_quantity ?? 0, total_value: result?.total_value ?? 0 };
    }
}
