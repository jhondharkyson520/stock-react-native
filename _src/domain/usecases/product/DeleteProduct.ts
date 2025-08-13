import { IProductRepository } from "../../repositories/IProductRepository";

export class DeleteProducts {
    constructor(private productRepository: IProductRepository) {};

    async execute(id: string) :Promise<void> {
        return this.productRepository.deleteProduct(id);
    }
}
