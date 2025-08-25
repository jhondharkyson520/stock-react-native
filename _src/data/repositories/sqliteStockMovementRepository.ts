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

  
  async costMonthProductsInReal(month: number, year: number): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      `SELECT SUM(cost) as total 
      FROM stock_movements 
      WHERE strftime('%m', date_movement) = ? AND strftime('%Y', date_movement) = ?`,
      [month.toString().padStart(2, "0"),  year.toString()]
    );

    return result?.total ?? 0;
  }

  async getFirstYear(): Promise<number | null> {
    const result = await this.db.getFirstAsync<{ firstYear: string }>(
      `SELECT MIN(strftime('%Y', date_movement)) as firstYear FROM stock_movements`
    );

    if (result?.firstYear) {
      return parseInt(result.firstYear, 10);
    }
    return null;
  }

  async costPerYear(year: number): Promise<number> {
    const result = await this.db.getFirstAsync<{ total_cost: number }>(
      `SELECT strftime('%Y', date_movement) AS year, 
       SUM(cost) AS total_cost
       FROM stock_movements
       GROUP BY year
       ORDER BY year`,
      [year.toString()]
    );

    return result?.total_cost ?? 0;
  }

  async rankingProductsInStock(): Promise<{ product_id: string; total_added: number }[]> {
    return await this.db.getAllAsync(
      `SELECT product_id, SUM(qtd) AS total_added
       FROM stock_movements
       WHERE type = 'in'
       GROUP BY product_id
       ORDER BY total_added DESC`
    );
  }

  async highRotationProducts(): Promise<{ product_id: string; total_movement: number }[]> {
    return await this.db.getAllAsync(
      `SELECT product_id, SUM(qtd) AS total_movement
       FROM stock_movements
       GROUP BY product_id
       ORDER BY total_movement DESC`
    );
  }

  async productsWithoutRecentMovement(days: number = 30): Promise<{ product_id: string; last_movement: string | null }[]> {
    return await this.db.getAllAsync(
      `SELECT product_id, MAX(date_movement) AS last_movement
       FROM stock_movements
       GROUP BY product_id
       HAVING last_movement IS NULL OR last_movement < date('now', ? || ' days')`,
      [-days]
    );
  }

  async movementsByPeriod(startDate: string, endDate: string): Promise<StockMovement[]> {
    return await this.db.getAllAsync(
      `SELECT *
       FROM stock_movements
       WHERE date_movement BETWEEN ? AND ?
       ORDER BY date_movement DESC`,
      [startDate, endDate]
    );
  }

  async movementsByType(): Promise<{ type: string; total_movements: number; total_quantity: number }[]> {
    return await this.db.getAllAsync(
      `SELECT type, COUNT(*) AS total_movements, SUM(qtd) AS total_quantity
       FROM stock_movements
       GROUP BY type`
    );
  }

  async costByMonthYear(): Promise<{ year: string; month: string; total_cost: number }[]> {
    return await this.db.getAllAsync(
      `SELECT strftime('%Y', date_movement) AS year,
              strftime('%m', date_movement) AS month,
              SUM(cost) AS total_cost
       FROM stock_movements
       GROUP BY year, month
       ORDER BY year, month`
    );
  }

  async recentMovements(limit: number = 10): Promise<StockMovement[]> {
    return await this.db.getAllAsync(
      `SELECT *
       FROM stock_movements
       ORDER BY date_movement DESC
       LIMIT ?`,
      [limit]
    );
  }
}
