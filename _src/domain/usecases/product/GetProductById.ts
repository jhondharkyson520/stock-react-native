import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class GetProductById {
    constructor(private productRepository: IProductRepository) {};

    async execute(id: string) :Promise<Product | null> {
        return this.productRepository.getByIdProduct(id);
    }
}
