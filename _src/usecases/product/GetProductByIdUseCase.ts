import { Product } from "../../domain/models/Products";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class GetProductByIdUseCase {
    constructor(private productRepository: IProductRepository) {};

    async execute(id: string) :Promise<Product | null> {
        if (!id) throw new Error('Id is required to find product');
        return await this.productRepository.getByIdProduct(id);
    }
}
