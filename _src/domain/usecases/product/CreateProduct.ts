import { Product } from "../../models/Products";
import { IProductRepository } from "../../repositories/IProductRepository";

export class CreateProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Omit<Product, "id">): Promise<Product> {
    return this.productRepository.createProduct(product);
  }
}
