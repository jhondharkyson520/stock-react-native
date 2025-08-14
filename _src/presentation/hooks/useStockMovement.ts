import { SQLiteStockMovementRepository } from "@/_src/data/repositories/sqliteStockMovementRepository";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { CreateStockMovement } from "@/_src/domain/usecases/stockMovement/CreateStockMovement";
import { useState } from "react";

const stockMovementRepository = new SQLiteStockMovementRepository();
const createStockMovementUseCase = new CreateStockMovement(stockMovementRepository);

export const useStockMovement = () => {
  const [stock, setStock] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStock = async (stockMovement: Omit<StockMovement, "id">) => {
    try {
      await createStockMovementUseCase.execute(stockMovement);
      setStock([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  return {stock, loading, error, handleCreateStock};
};
