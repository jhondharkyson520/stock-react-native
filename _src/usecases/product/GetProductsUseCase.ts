import { Product } from "../../domain/models/Products";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class GetProductsUseCase {
    constructor(private productRepository: IProductRepository) {};
    async execute(): Promise<Product[]> {
        return await this.productRepository.getAllProducts();
    }
}
