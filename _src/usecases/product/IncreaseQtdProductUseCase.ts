import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class IncreaseQtdProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productCode: string, qtd: number, value: number): Promise<void> {
    if (!productCode) throw new Error("Product code is required");
    if (qtd == null || qtd <= 0) throw new Error("Invalid quantity");
    if(!value) throw new Error("Value is required")

    const product = await this.productRepository.findByCode(productCode);
    if (!product) throw new Error("Product not found");

    await this.productRepository.updateQuantityAndValue(productCode, product.qtd + qtd, value);
  }
}

