import { StockMovement } from "../../models/StockMovement";
import { IStockMovementRepository } from "../../repositories/IStockMovementRepository";

export class CreateStockMovement {
  constructor(private stockRepository: IStockMovementRepository) {}

  async execute(stockMovement: Omit<StockMovement, "id">): Promise<StockMovement> {
    return this.stockRepository.createStock(stockMovement);
  }
}
