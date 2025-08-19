import { StockMovement } from "../../models/StockMovement";
import { IStockMovementRepository } from "../../repositories/IStockMovementRepository";

export class GetHistoryStock {
    constructor(private stockMovementRepository: IStockMovementRepository){};
    async execute(): Promise<StockMovement[]> {
        return this.stockMovementRepository.getHistoryStock();
    }
}