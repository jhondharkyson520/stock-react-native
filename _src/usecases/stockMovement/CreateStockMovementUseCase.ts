import { StockMovement } from "../../domain/models/StockMovement";
import { IStockMovementRepository } from "../../domain/repositories/IStockMovementRepository";

export class CreateStockMovementUseCase {
  constructor(private stockRepository: IStockMovementRepository) {}

  async execute(stockMovement: StockMovement): Promise<StockMovement> {
    if(!stockMovement) throw new Error('Erro ao criar movimentação');    
    const valueResult = Number(stockMovement.qtd) * Number(stockMovement.cost)
    const toSave = {...stockMovement, cost: valueResult}
    return await this.stockRepository.createStock(toSave);
  }
}
