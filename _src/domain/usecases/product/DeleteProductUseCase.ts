import { IProductRepository } from "../../repositories/IProductRepository";

export class DeleteProductsUseCase {
    constructor(private productRepository: IProductRepository) {};

    async execute(id: string) :Promise<void> {
        if(!id) throw new Error('Id is required to delete');
        await this.productRepository.deleteProduct(id);
    }
}
