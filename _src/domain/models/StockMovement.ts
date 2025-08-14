export interface StockMovement {
    id: string;
    product_id: string;
    type: string; //entrada ou saida
    qtd: number;
    cost: number;
    date_movement: Date;
}
