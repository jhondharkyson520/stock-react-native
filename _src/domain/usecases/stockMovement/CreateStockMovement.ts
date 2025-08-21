import { StockMovement } from "../../models/StockMovement";
import { IStockMovementRepository } from "../../repositories/IStockMovementRepository";

export class CreateStockMovement {
  constructor(private stockRepository: IStockMovementRepository) {}

  async execute(stockMovement: StockMovement): Promise<StockMovement> {
    return this.stockRepository.createStock(stockMovement);
  }
}
