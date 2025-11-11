export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    type: string; //administrador ou comum
    created_date?: Date;
    updated_date?: Date;
}
