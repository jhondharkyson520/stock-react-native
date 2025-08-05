import { User } from "../models/User";

export interface IUserRepository {
    createUser(user: Omit<User, 'id'>): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getByIdUser(id: string): Promise<User | null>;    
    updateUser(user: User): Promise<void>;
    deleteUser(id: string): Promise<void>;
}
