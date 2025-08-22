import { Product } from "../../domain/models/Products";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class GetProductByBarCodeUseCase {
    constructor(private productRepository: IProductRepository) {};

    async execute(code: string) :Promise<Product | null> {
        if(!code) throw new Error('Code is required to find by bar code');
        return await this.productRepository.getByBarCodeProduct(code);
    }
}
