import { IProductRepository } from "../../repositories/IProductRepository";

export class DecreaseQtdProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(productCode: string, qtd: number): Promise<void> {
    if (!productCode) throw new Error("Product code is required");
    if (qtd == null || qtd <= 0) throw new Error("Invalid quantity");

    const product = await this.productRepository.findByCode(productCode);
    if (!product) throw new Error("Product not found");

    if (product.qtd < qtd) {
      throw new Error("Insufficient stock");
    }


    await this.productRepository.updateQuantity(productCode, product.qtd - qtd);
  }
}
