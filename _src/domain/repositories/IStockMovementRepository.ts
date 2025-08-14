import { StockMovement } from "../models/StockMovement";

export interface IStockMovementRepository {
    createStock(stockMovement: Omit<StockMovement, 'id'>): Promise<StockMovement>;
}
