import { IStockMovementRepository } from "../../repositories/IStockMovementRepository";

export class DeleteHistoryStock {
    constructor(private stockMovementRepository: IStockMovementRepository) {};

    async execute(id: string) :Promise<void> {
        return this.stockMovementRepository.deleteStockHistoryById(id);
    }
}
