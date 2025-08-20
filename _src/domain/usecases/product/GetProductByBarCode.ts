import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class GetProductByBarCode {
    constructor(private productRepository: IProductRepository) {};

    async execute(code: string) :Promise<Product | null> {
        return this.productRepository.getByBarCodeProduct(code);
    }
}
