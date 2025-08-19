export interface Caixa {
    id: string;
    type: string; //entrada/saída
    description: string;
    value: number;
    date_movement: Date;
}
