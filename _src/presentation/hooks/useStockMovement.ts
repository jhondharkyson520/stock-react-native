
import { useDatabase } from "@/_src/data/db/DataBaseContext";
import { SQLiteStockMovementRepository } from "@/_src/data/repositories/sqliteStockMovementRepository";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { CreateStockMovementUseCase } from "@/_src/usecases/stockMovement/CreateStockMovementUseCase";
import { DeleteHistoryStockByIdUseCase } from "@/_src/usecases/stockMovement/DeleteHistoryStockByIdUseCase";
import { GetHistoryStockUseCase } from "@/_src/usecases/stockMovement/GetHistoryStockUseCase";
import { useCallback, useState } from "react";



export const useStockMovement = () => {
  const db = useDatabase();
  const stockMovementRepository = new SQLiteStockMovementRepository(db);
  const createStockMovementUseCase = new CreateStockMovementUseCase(stockMovementRepository);
  const getHistoryStockUseCase = new GetHistoryStockUseCase(stockMovementRepository);
  const deleteHistoryStockByIdUseCase = new DeleteHistoryStockByIdUseCase(stockMovementRepository);
  const [stock, setStock] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStockUseStockMovement = async (stockMovement: StockMovement) => {    
    await createStockMovementUseCase.execute(stockMovement);
    if(createStockMovementUseCase) {
      setStock(prev => [...prev, stockMovement]);
    }else {
      throw new Error('Erro ao cadastrar movimentação de estoque');
    }    
  };

  const handleGetHistoryStockUseStockMovement = useCallback(async () => {
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
  

  const handleDeleteHistoryStockUseStockMovement = async (id: string) => {    
    try {
      setLoading(true);
      await deleteHistoryStockByIdUseCase.execute(id);
      setStock(prev => prev.filter(stock => stock.id !== id)); 
    } catch (err) {
      console.error(err);
      setError("Failed to delete stock history");
    } finally {
      setLoading(false);
    }
  }

  return {stock, loading, error, handleCreateStockUseStockMovement, handleGetHistoryStockUseStockMovement, handleDeleteHistoryStockUseStockMovement};
};
