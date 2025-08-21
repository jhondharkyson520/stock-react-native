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

    async getByBarCodeProduct(code: string): Promise<Product | null> {
        try {
            const result = await db.getFirstAsync<Product>('SELECT * FROM products WHERE code=?', [code]);
            //console.log('Resultado da query:', result);
            return result;
        } catch (err) {
            //console.error('Erro na query getByBarCodeProduct:', err);
            return null;
        }
    }

    async dumpProducts(): Promise<Product[]> {
        try {
            const allProducts = await db.getAllAsync<Product>('SELECT * FROM products');
            console.log('Dump completo da tabela products:', allProducts);
            return allProducts;
        } catch (err) {
            console.error('Erro no dump:', err);
            return [];
        }
    }

    async updateProduct(product: Product): Promise<void> {
        if(!product.id) {
            throw new Error("Product ID is required for update.");
        }
        
        await db.runAsync(`UPDATE products SET name = ?, code = ?, description = ?, qtd = ?, value = ?, image = ? WHERE id = ?`,
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

    async increaseQtdProduct(product: Partial<Product>): Promise<void> {
        if (product.qtd == null || !product.code) {
            throw new Error("Product QTD or BAR CODE is required for stock increase.");
        }

        const qtdChange = Number(product.qtd);
        if (isNaN(qtdChange) || qtdChange <= 0) {
            throw new Error("Quantidade inválida para entrada.");
        }

        const current = await db.getFirstAsync<{ qtd: number }>(
            `SELECT qtd FROM products WHERE code = ?`,
            [product.code]
        );

        if (!current) {
            throw new Error("Produto não encontrado para atualizar estoque.");
        }

        const newQtd = Number(current.qtd) + qtdChange;

        await db.runAsync(
            `UPDATE products SET qtd = ? WHERE code = ?`,
            [newQtd, product.code]
        );
    }

    async decreaseQtdProduct(product: Partial<Product>): Promise<void> {
        if (product.qtd == null || !product.code) {
            throw new Error("Product QTD or BAR CODE is required for stock decrease.");
        }

        const qtdChange = Number(product.qtd);
        if (isNaN(qtdChange) || qtdChange <= 0) {
            throw new Error("Quantidade inválida para saída.");
        }

        const current = await db.getFirstAsync<{ qtd: number }>(
            `SELECT qtd FROM products WHERE code = ?`,
            [product.code]
        );

        if (!current) {
            throw new Error("Produto não encontrado para atualizar estoque.");
        }

        const qtdAtual = Number(current.qtd);
        if (qtdAtual < qtdChange) {
            throw new Error("Estoque insuficiente para saída.");
        }

        const newQtd = qtdAtual - qtdChange;

        await db.runAsync(
            `UPDATE products SET qtd = ? WHERE code = ?`,
            [newQtd, product.code]
        );
    }

    async findByCode(code: string): Promise<Product | null> {
    const result = await db.getFirstAsync("SELECT * FROM products WHERE code = ?", [code]);
    return result ? (result as Product) : null;
  }

  async updateQuantity(code: string, qtd: number): Promise<void> {
    await db.runAsync("UPDATE products SET qtd = ? WHERE code = ?", [qtd, code]);
  }

    async deleteProduct(id: string): Promise<void> {
        await db.runAsync("DELETE FROM products WHERE id=?", [id]);
    }
}
