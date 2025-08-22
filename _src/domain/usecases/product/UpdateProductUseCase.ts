import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Product): Promise<void> {
    if (!product.id) {
      throw new Error("Product ID is required for update.");
    }
    await this.productRepository.updateProduct(product);
  }
}
