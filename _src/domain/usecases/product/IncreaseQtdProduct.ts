import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class IncreaseQtdProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Partial<Product>): Promise<void> {
    return this.productRepository.increaseQtdProduct(product);
  }
}
