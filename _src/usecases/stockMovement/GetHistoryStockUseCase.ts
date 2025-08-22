import { StockMovement } from "../../domain/models/StockMovement";
import { IStockMovementRepository } from "../../domain/repositories/IStockMovementRepository";

export class GetHistoryStockUseCase {
    constructor(private stockMovementRepository: IStockMovementRepository){};
    async execute(): Promise<StockMovement[]> {
        return await this.stockMovementRepository.getHistoryStock();
    }
}