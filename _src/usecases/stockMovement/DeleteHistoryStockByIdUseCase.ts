import { IStockMovementRepository } from "../../domain/repositories/IStockMovementRepository";

export class DeleteHistoryStockByIdUseCase {
    constructor(private stockMovementRepository: IStockMovementRepository) {};

    async execute(id: string) :Promise<void> {
        if(!id) throw new Error('Id is required');
        return await this.stockMovementRepository.deleteStockHistoryById(id);
    }
}
