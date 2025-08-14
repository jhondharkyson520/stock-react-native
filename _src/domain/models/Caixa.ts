export interface Caixa {
    id: string;
    type: string; //entrada ou saída
    description: string;
    value: number;
    date_movement: Date;
}
