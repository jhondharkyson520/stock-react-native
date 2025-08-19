import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class GetProducts {
    constructor(private productRepository: IProductRepository) {};
    async execute(): Promise<Product[]> {
        return this.productRepository.getAllProducts();
    }
}
