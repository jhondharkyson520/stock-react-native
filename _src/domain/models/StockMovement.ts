export interface StockMovement {
    id: string;
    product_id: string;
    type: string; 
    qtd: number;
    cost: number;
    date_movement: string;
}
