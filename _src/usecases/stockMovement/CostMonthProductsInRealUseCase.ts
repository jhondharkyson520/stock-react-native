import { IStockMovementRepository } from "../../domain/repositories/IStockMovementRepository";

export class CostMonthProductsInRealUseCase {
    constructor(private stockMovementRepository: IStockMovementRepository){};
    async execute(month: number, year: number): Promise<number> {
       return await this.stockMovementRepository.costMonthProductsInReal(month, year);
    }
}