
import { SQLiteStockMovementRepository } from "@/_src/data/repositories/sqliteStockMovementRepository";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { CreateStockMovement } from "@/_src/domain/usecases/stockMovement/CreateStockMovement";
import { GetHistoryStock } from "@/_src/domain/usecases/stockMovement/GetHistoryStock";
import { useState } from "react";

const stockMovementRepository = new SQLiteStockMovementRepository();
const createStockMovementUseCase = new CreateStockMovement(stockMovementRepository);
const getHistoryStockUseCase = new GetHistoryStock(stockMovementRepository)

export const useStockMovement = () => {
  const [stock, setStock] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStock = async (stockMovement: StockMovement) => {
    try {
      await createStockMovementUseCase.execute(stockMovement);
      setStock([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  const handleGetHistoryStock = async () => {
    setLoading(true);
    const result = await getHistoryStockUseCase.execute();
    setStock(result);
    setError(null);
    return stock;
  }

  return {stock, loading, error, handleCreateStock, handleGetHistoryStock};
};
