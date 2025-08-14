import { StockMovement } from "@/_src/domain/models/StockMovement";
import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { getDB } from "../db";

let db: SQLiteDatabase;
(async ()=> {
    db = await getDB();
})();

export class SQLiteStockMovementRepository implements IStockMovementRepository{
    async createStock(stockMovement: Omit<StockMovement, "id">): Promise<StockMovement> {
        const result = await db.runAsync(
            `INSERT INTO stock_movements (product_id, type, qtd, cost) VALUES (?, ?, ?, ?)`,
            [
                stockMovement.product_id,
                stockMovement.type,
                stockMovement.qtd,
                stockMovement.cost
            ]
        );

        if (result.lastInsertRowId) {
            return { id: String(result.lastInsertRowId), ...stockMovement };
        }

        throw new Error("Failed to create stock.");
    }
}
