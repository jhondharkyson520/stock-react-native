import { StockMovement } from "@/_src/domain/models/StockMovement";
import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";
import { SQLiteDatabase } from "expo-sqlite";



export class SQLiteStockMovementRepository implements IStockMovementRepository {
  private db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    if (!db) {
      throw new Error("DB não pode ser nulo");
    }
    this.db = db;
  }
  async createStock(stockMovement: StockMovement): Promise<StockMovement> {
    await this.db.runAsync(
        `INSERT INTO stock_movements (id, product_id, type, qtd, cost, date_movement) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            stockMovement.id,
            stockMovement.product_id,
            stockMovement.type,
            stockMovement.qtd,
            stockMovement.cost,
            stockMovement.date_movement,
        ]
    );
    return {
      ...stockMovement
    };
  }

  async getHistoryStock(): Promise<StockMovement[]> {
    const result = await this.db.getAllAsync(`SELECT id, product_id, type, qtd, cost, date_movement FROM stock_movements`);
    const stockMovements: StockMovement[] = result.map(item => item as StockMovement);
    return stockMovements;
  }

  async deleteStockHistoryById(id: string): Promise<void> {     
    await this.db.runAsync("DELETE FROM stock_movements WHERE id=?", [id]);  
  }

  
  getStockMovementById(id: string): Promise<StockMovement | null> {
    throw new Error("Method not implemented.");
  }
}
