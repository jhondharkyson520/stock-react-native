import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";

export class HighRotationProductsUseCase {
    constructor(private stockRepository: IStockMovementRepository){};
    async execute(){       
        return await this.stockRepository.highRotationProducts();
    }
}
