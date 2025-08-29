
export interface Product {
    id: string;
    name: string;
    code: string;
    description: string | null;
    qtd: number;
    value: number;
    image: string;
    created_date?: Date;
    updated_date?: Date;
}
