import { Product } from "@/_src/domain/models/Products";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { IStockMovementRepository } from "@/_src/domain/repositories/IStockMovementRepository";
import {
    collection,
    deleteDoc,
    doc,
    DocumentSnapshot,
    Firestore,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    setDoc
} from "firebase/firestore";

export class SQLiteStockMovementRepository implements IStockMovementRepository {
    private stockCol;
    private productsCol;

    constructor(private db: Firestore) {
        this.stockCol = collection(this.db, "stock_movements");
        this.productsCol = collection(this.db, "products");
    }

    async createStock(stockMovement: StockMovement): Promise<StockMovement> {
        const stockRef = doc(this.stockCol, stockMovement.id ?? undefined);

        const newStock: StockMovement = {
            ...stockMovement,
            id: stockRef.id,
            date_movement: new Date().toISOString(),
        };

        await setDoc(stockRef, {
            ...newStock,
            date_movement: serverTimestamp(),
        });

        return newStock;
    }

    async getHistoryStock(): Promise<StockMovement[]> {
        const q = query(this.stockCol, orderBy("date_movement", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => this.mapDocToStock(doc));
    }

    async deleteStockHistoryById(id: string): Promise<void> {
        const docRef = doc(this.stockCol, id);
        await deleteDoc(docRef);
    }

    async costMonthProductsInReal(month: number, year: number): Promise<number> {
        const snapshot = await getDocs(this.stockCol);
        let total = 0;
        snapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            const date = new Date(s.date_movement);
            if (date.getMonth() + 1 === month && date.getFullYear() === year) {
                total += s.cost;
            }
        });
        return total;
    }

    async getFirstYear(): Promise<number | null> {
        const snapshot = await getDocs(this.stockCol);
        const years = snapshot.docs
            .map((doc) => new Date(this.mapDocToStock(doc).date_movement).getFullYear());
        const first = years.length ? Math.min(...years) : null;
        return first;
    }

    async costPerYear(year: number): Promise<number> {
        const snapshot = await getDocs(this.stockCol);
        let total = 0;
        snapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            if (new Date(s.date_movement).getFullYear() === year) total += s.cost;
        });
        return total;
    }

    async rankingProductsInStock(): Promise<{ product_id: string; name: string; total_added: number }[]> {
        const snapshot = await getDocs(this.stockCol);
        const totals: Record<string, number> = {};
        snapshot.docs.forEach((doc) => {
            const s = doc.data() as { product_id: string; qtd: number; type: string };
            if (s.type === "entrada") {
                totals[s.product_id] = (totals[s.product_id] || 0) + s.qtd;
            }
        });
        const productsSnap = await getDocs(this.productsCol);
        const productsMap: Record<string, string> = {};
        productsSnap.docs.forEach((doc) => {
            const p = doc.data() as { name: string };
            productsMap[doc.id] = p.name;
        });

        return Object.entries(totals)
            .map(([product_id, total_added]) => ({
                product_id,
                name: productsMap[product_id] || "Produto desconhecido",
                total_added
            }))
            .sort((a, b) => b.total_added - a.total_added)
            .slice(0, 10);
    }


    async highRotationProducts(): Promise<{ product_id: string; name: string; total_movement: number }[]> {
        const stockSnapshot = await getDocs(this.stockCol);
        const productsSnapshot = await getDocs(this.productsCol);
        const productsMap: Record<string, string> = {};
        productsSnapshot.docs.forEach((doc) => {
            const p = this.mapDocToProduct(doc);
            productsMap[p.id] = p.name;
        });
        const totals: Record<string, number> = {};
        stockSnapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            totals[s.product_id] = (totals[s.product_id] || 0) + s.qtd;
        });

        return Object.entries(totals)
            .map(([product_id, total_movement]) => ({
                product_id,
                name: productsMap[product_id] || "Produto não encontrado",
                total_movement
            }))
            .sort((a, b) => b.total_movement - a.total_movement);
    }


    async productsWithoutRecentMovement(): Promise<{ product_id: string; name: string; last_movement: string | null }[]> {
        const productsSnapshot = await getDocs(this.productsCol);
        const stockSnapshot = await getDocs(this.stockCol);
        const lastMovements: Record<string, string> = {};
        stockSnapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            const last = lastMovements[s.product_id];
            if (!last || new Date(s.date_movement) > new Date(last)) {
                lastMovements[s.product_id] = s.date_movement;
            }
        });
        const now = new Date();
        const DAYS = 30;
        const thresholdTime = now.getTime() - DAYS * 24 * 60 * 60 * 1000;
        const filteredProducts = productsSnapshot.docs
            .map((doc) => {
                const p = this.mapDocToProduct(doc);
                const last = lastMovements[p.id];
                const last_movement =
                    !last || new Date(last).getTime() < thresholdTime
                        ? last || null
                        : null;

                return {
                    product_id: p.id,
                    name: p.name,
                    last_movement,
                };
            })
            .filter(p => p.last_movement !== null);

        return filteredProducts;
    }

    async movementsByPeriod(startDate: string, endDate: string): Promise<StockMovement[]> {
        const snapshot = await getDocs(this.stockCol);
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return snapshot.docs
            .map((doc) => this.mapDocToStock(doc))
            .filter((s) => {
                const ts = new Date(s.date_movement).getTime();
                return ts >= start && ts <= end;
            });
    }

    async movementsByType(): Promise<{ type: string; total_movements: number; total_quantity: number }[]> {
        const snapshot = await getDocs(this.stockCol);
        const totals: Record<string, { total_movements: number; total_quantity: number }> = {};

        snapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            if (!totals[s.type]) totals[s.type] = { total_movements: 0, total_quantity: 0 };
            totals[s.type].total_movements += 1;
            totals[s.type].total_quantity += s.qtd;
        });

        return Object.entries(totals).map(([type, t]) => ({
            type,
            total_movements: t.total_movements,
            total_quantity: t.total_quantity,
        }));
    }

    async costByMonthYear(): Promise<{ year: string; month: string; total_cost: number }[]> {
        const snapshot = await getDocs(this.stockCol);
        const totals: Record<string, number> = {};

        snapshot.docs.forEach((doc) => {
            const s = this.mapDocToStock(doc);
            const d = new Date(s.date_movement);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
            totals[key] = (totals[key] || 0) + s.cost;
        });

        return Object.entries(totals).map(([key, total_cost]) => {
            const [year, month] = key.split("-");
            return { year, month, total_cost };
        });
    }

    async recentMovements(limitCount: number): Promise<StockMovement[]> {
        const q = query(this.stockCol, orderBy("date_movement", "desc"), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => this.mapDocToStock(doc));
    }

    private mapDocToStock(doc: DocumentSnapshot | QueryDocumentSnapshot): StockMovement {
        const data = doc.data();
        if (!data) return null as any;

        return {
            id: data.id ?? doc.id,
            product_id: data.product_id,
            type: data.type,
            qtd: data.qtd ?? 0,
            cost: data.cost ?? 0,
            date_movement: data.date_movement?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        };
    }

    private mapDocToProduct(doc: DocumentSnapshot | QueryDocumentSnapshot): Product {
        const dataproduct = doc.data();
        if (!dataproduct) return null as any;

        return {
            id: dataproduct.id ?? doc.id,
            name: dataproduct.name,
            code: dataproduct.code,
            description: dataproduct.description ?? null,
            qtd: dataproduct.qtd ?? 0,
            value: dataproduct.value ?? 0,
            image: dataproduct.image ?? "",
            created_date: dataproduct.created_date?.toDate?.() ?? new Date(),
            updated_date: dataproduct.updated_date?.toDate?.() ?? new Date(),
        };
    }
}


