import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";

export class RankingProductsInStockUseCase {
    constructor(private stockRepository: IStockMovementRepository){};

    async execute(){       
        return await this.stockRepository.rankingProductsInStock();
    }    
}
