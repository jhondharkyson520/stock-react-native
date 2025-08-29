import { Product } from "@/_src/domain/models/Products";
import { IProductRepository } from "@/_src/domain/repositories/IProductRepository";
import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export class SQLiteProductRepository implements IProductRepository {
  private productsCol;

  constructor(private db: Firestore) {
    this.productsCol = collection(this.db, "products");
  }

  async createProduct(product: Product): Promise<Product> {
    const productRef = doc(this.productsCol, product.id ?? undefined);

    const newProduct: Product = {
      ...product,
      id: productRef.id,
      created_date: new Date(),
      updated_date: new Date(),
    };

    await setDoc(productRef, {
      ...newProduct,
      created_date: serverTimestamp(),
      updated_date: serverTimestamp(),
    });

    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(this.productsCol);
    return snapshot.docs.map((doc) => this.mapDocToProduct(doc));
  }

  async getByIdProduct(id: string): Promise<Product | null> {
    const docRef = doc(this.productsCol, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapDocToProduct(snapshot) : null;
  }

  async getByBarCodeProduct(code: string): Promise<Product | null> {
    const q = query(this.productsCol, where("code", "==", code));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return this.mapDocToProduct(snapshot.docs[0]);
  }

  async updateProduct(product: Product): Promise<void> {
    if (!product.id) throw new Error("ID do produto é obrigatório.");
    const docRef = doc(this.productsCol, product.id);
    await updateDoc(docRef, {
      ...product,
      updated_date: serverTimestamp(),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(this.productsCol, id);
    await deleteDoc(docRef);
  }

  async findByCode(code: string): Promise<Product | null> {
    return this.getByBarCodeProduct(code);
  }

  async updateQuantity(code: string, qtd: number): Promise<void> {
    const product = await this.getByBarCodeProduct(code);
    if (!product) return;
    const docRef = doc(this.productsCol, product.id);
    await updateDoc(docRef, { qtd, updated_date: serverTimestamp() });
  }

  async updateQuantityAndValue(code: string, qtd: number, value: number): Promise<void> {
    const product = await this.getByBarCodeProduct(code);
    if (!product) return;
    const docRef = doc(this.productsCol, product.id);
    await updateDoc(docRef, { qtd, value, updated_date: serverTimestamp() });
  }

  async listOfProductsOfQtdMinimumInStock(): Promise<Product[]> {
    const q = query(this.productsCol, where("qtd", "<", 3));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapDocToProduct(doc));
  }

  async totalStockValueAndQuantity(): Promise<{ total_quantity: number; total_value: number }> {
    const snapshot = await getDocs(this.productsCol);
    let total_quantity = 0;
    let total_value = 0;
    snapshot.docs.forEach((doc) => {
      const p = this.mapDocToProduct(doc);
      total_quantity += p.qtd;
      total_value += p.qtd * p.value;
    });
    return { total_quantity, total_value };
  }

  async dumpProducts(): Promise<Product[]> {
    const snapshot = await getDocs(this.productsCol);
    const products = snapshot.docs.map((doc) => this.mapDocToProduct(doc));
    console.log("Dump completo da tabela products:", products);
    return products;
  }

  private mapDocToProduct(doc: DocumentSnapshot | QueryDocumentSnapshot): Product {
    const data = doc.data();
    if (!data) return null as any;

    return {
      id: data.id ?? doc.id,
      name: data.name,
      code: data.code,
      description: data.description ?? null,
      qtd: data.qtd ?? 0,
      value: data.value ?? 0,
      image: data.image ?? "",
      created_date: data.created_date?.toDate?.() ?? new Date(),
      updated_date: data.updated_date?.toDate?.() ?? new Date(),
    };
  }
}
