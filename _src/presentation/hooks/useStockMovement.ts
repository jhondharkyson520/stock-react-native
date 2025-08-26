
import { useDatabase } from "@/_src/data/db/DataBaseContext";
import { SQLiteStockMovementRepository } from "@/_src/data/repositories/sqliteStockMovementRepository";
import { StockMovement } from "@/_src/domain/models/StockMovement";
import { CostMonthProductsInRealUseCase } from "@/_src/usecases/stockMovement/CostMonthProductsInRealUseCase";
import { CostPerYearUseCase } from "@/_src/usecases/stockMovement/CostPerYearUseCase";
import { CreateStockMovementUseCase } from "@/_src/usecases/stockMovement/CreateStockMovementUseCase";
import { DeleteHistoryStockByIdUseCase } from "@/_src/usecases/stockMovement/DeleteHistoryStockByIdUseCase";
import { GetHistoryStockUseCase } from "@/_src/usecases/stockMovement/GetHistoryStockUseCase";
import { HighRotationProductsUseCase } from "@/_src/usecases/stockMovement/HighRotationProductsUseCase";
import { ProductsWithoutRecentMovementUseCase } from "@/_src/usecases/stockMovement/ProductsWithoutRecentMovementUseCase";
import { RankingProductsInStockUseCase } from "@/_src/usecases/stockMovement/RankingProductsInStockUseCase";
import { useCallback, useEffect, useState } from "react";



export const useStockMovement = () => {
  const db = useDatabase();
  const stockMovementRepository = new SQLiteStockMovementRepository(db);
  const createStockMovementUseCase = new CreateStockMovementUseCase(stockMovementRepository);
  const getHistoryStockUseCase = new GetHistoryStockUseCase(stockMovementRepository);
  const deleteHistoryStockByIdUseCase = new DeleteHistoryStockByIdUseCase(stockMovementRepository);
  const costMonthProductsInRealUseCase = new CostMonthProductsInRealUseCase(stockMovementRepository);
  const costPerYearUseCase = new CostPerYearUseCase(stockMovementRepository);
  const rankingProductsInStockUseCase = new RankingProductsInStockUseCase(stockMovementRepository);
  const highRotationProductsUseCase = new HighRotationProductsUseCase(stockMovementRepository);
  const productsWithoutRecentMovementUseCase = new ProductsWithoutRecentMovementUseCase(stockMovementRepository);

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

  const costByMonthUseStockMovement = async (month: number, year: number) => {
    if(!month || !year) throw new Error('Month and Year is required');
    const totalCost = await costMonthProductsInRealUseCase.execute(month, year);
    return totalCost;
  }

  const [firstYear, setFirstYear] = useState<number | null>(null);

  const fetchFirstYear = async () => {
    const year = await stockMovementRepository.getFirstYear();
    setFirstYear(year);
  };

  const costPerYearUseStockMovement = async (year: number) => {
    if(!year) throw new Error('Year is required to cost per year use stocks');
    const costPerYearResult = await costPerYearUseCase.execute(year);
    return costPerYearResult;
  }

  const rankingProductsInStockUseStockMovement = async () => {
    const result = await rankingProductsInStockUseCase.execute();
    if(!result) throw new Error("Error in loading ranking of products in Stock");
    return result;    
  }

  const highRotationProductsUseStockMovement = async () => {
    const result = await highRotationProductsUseCase.execute();
    if(!result) throw new Error("Error in loading products high rotation in Stock");
    return result;    
  }

  const productsWithoutRecentMovementUseStockMovement = async () => {
    const result = await productsWithoutRecentMovementUseCase.execute();
    if(!result) throw new Error("Error in loading products without recent movement");
    return result;    
  }



  useEffect(() => {
    fetchFirstYear();
  }, []);

  return {
    stock, 
    loading, 
    error, 
    handleCreateStockUseStockMovement, 
    handleGetHistoryStockUseStockMovement, 
    handleDeleteHistoryStockUseStockMovement, 
    costByMonthUseStockMovement, 
    fetchFirstYear, 
    firstYear,
    costPerYearUseStockMovement,
    rankingProductsInStockUseStockMovement,
    highRotationProductsUseStockMovement,
    productsWithoutRecentMovementUseStockMovement
  };
};
