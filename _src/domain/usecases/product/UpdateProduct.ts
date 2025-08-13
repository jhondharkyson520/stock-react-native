import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class UpdateProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Product): Promise<void> {
    return this.productRepository.updateProduct(product);
  }
}
