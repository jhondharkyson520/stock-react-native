import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";

export class CostPerYearUseCase {
    constructor(private stockRepository: IStockMovementRepository){};

    async execute(year: number){
        if(!year) throw new Error('Year is require to cost year');        
        return await this.stockRepository.costPerYear(year);
    }    
}