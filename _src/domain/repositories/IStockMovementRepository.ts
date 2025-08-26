import { StockMovement } from "../models/StockMovement";

export interface IStockMovementRepository {
    createStock(stockMovement: StockMovement): Promise<StockMovement>;
    getHistoryStock(): Promise<StockMovement[]>;
    deleteStockHistoryById(id: string): Promise<void>;
    costMonthProductsInReal(month: number, year: number): Promise<number>;
    getFirstYear(): Promise<number | null>;

    costPerYear(year: number): Promise<number>;
    rankingProductsInStock(): Promise<{ product_id: string; name: string; total_added: number }[]>;
    highRotationProducts(): Promise<{ product_id: string; name: string; total_movement: number }[]>;
    productsWithoutRecentMovement(): Promise<{ product_id: string; name: string; last_movement: string | null }[]>;
}
