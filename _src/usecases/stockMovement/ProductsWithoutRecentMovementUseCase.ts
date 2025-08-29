import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";

export class ProductsWithoutRecentMovementUseCase {
    constructor(private stockRepository: IStockMovementRepository){};
    async execute(){
        const result = await this.stockRepository.productsWithoutRecentMovement();
        if(!result) throw new Error('Error in load products without recent movement');
        return result;
    }
}
