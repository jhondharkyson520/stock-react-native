import { Product } from "../../domain/models/Products";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(product: Product): Promise<Product> {
    return this.productRepository.createProduct(product);
  }
}
