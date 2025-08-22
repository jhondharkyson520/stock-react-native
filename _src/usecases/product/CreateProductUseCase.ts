import { Product } from "../../domain/models/Products";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Omit<Product, "id">): Promise<Product> {
    return this.productRepository.createProduct(product);
  }
}
