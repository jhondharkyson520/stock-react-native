import { StockMovement } from "../models/StockMovement";

export interface IStockMovementRepository {
    createStock(stockMovement: StockMovement): Promise<StockMovement>;
    getHistoryStock(): Promise<StockMovement[]>;
    deleteStockHistoryById(id: string): Promise<void>;
}
