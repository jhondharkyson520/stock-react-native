
import { SQLiteStockMovementRepository } from "@/_src/data/repositories/sqliteStockMovementRepository";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { CreateStockMovement } from "@/_src/domain/usecases/stockMovement/CreateStockMovement";
import { DeleteHistoryStock } from "@/_src/domain/usecases/stockMovement/DeleteHistoryStock";
import { GetHistoryStock } from "@/_src/domain/usecases/stockMovement/GetHistoryStock";
import { useCallback, useState } from "react";

const stockMovementRepository = new SQLiteStockMovementRepository();
const createStockMovementUseCase = new CreateStockMovement(stockMovementRepository);
const getHistoryStockUseCase = new GetHistoryStock(stockMovementRepository);
const deleteHistoryStockUseCase = new DeleteHistoryStock(stockMovementRepository);

export const useStockMovement = () => {
  const [stock, setStock] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStock = async (stockMovement: StockMovement) => {
    try {
      await createStockMovementUseCase.execute(stockMovement);
      setStock(prev => [...prev, stockMovement]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  const handleGetHistoryStock = useCallback(async () => {
     try {
      setLoading(true);
      const result = await getHistoryStockUseCase.execute();
      setStock(result);
      setError(null);
      return stock;
    } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }, []);
  

  const handleDeleteHistoryStock = async (id: string) => {    
    try {
      setLoading(true);
      await deleteHistoryStockUseCase.execute(id);
      setStock(prev => prev.filter(stock => stock.id !== id)); 
    } catch (err) {
      console.error(err);
      setError("Failed to delete stock history");
    } finally {
      setLoading(false);
    }
  }

  return {stock, loading, error, handleCreateStock, handleGetHistoryStock, handleDeleteHistoryStock};
};
