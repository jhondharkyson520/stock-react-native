import { StockMovement } from "@/_src/domain/models/StockMovement";
import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { getDB } from "../db";

let db: SQLiteDatabase;
(async () => {
  db = await getDB();
})();

export class SQLiteStockMovementRepository implements IStockMovementRepository {
  getHistoryStockEntry(): Promise<StockMovement> {
    throw new Error("Method not implemented.");
  }
  async createStock(stockMovement: StockMovement): Promise<StockMovement> {
    try {
      //console.log("Inserindo no banco:", stockMovement);
      const result = await db.runAsync(
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
      //console.log("Inserido com sucesso:", result);
      return {
        ...stockMovement
      };
    } catch (error) {
      //console.error("Erro ao inserir entrada de estoque:", error);
      throw new Error(`Erro ao inserir entrada de estoque`);
    }
  }

  async getHistoryStock(): Promise<StockMovement[]> {
    try {
      const result = await db.getAllAsync(`SELECT id, product_id, type, qtd, cost, date_movement FROM stock_movements`);
      const stockMovements: StockMovement[] = result.map(item => item as StockMovement);

      return stockMovements;
    } catch (err) {
      console.log('Erro em getHistoryStockEntry: ', err);
      throw new Error(`Erro ao selecionar historico de estoque`);
    }
  }
}
