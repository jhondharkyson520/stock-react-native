import { User } from "@/_src/domain/models/User";
import { IUserRepository } from "@/_src/domain/repositories/IUserRepository";
import {
  collection,
  doc,
  Firestore,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

export class DbUserRepository implements IUserRepository {
  private usersCol;

  constructor(private db: Firestore) {
    this.usersCol = collection(this.db, "user");
  }

  async createUser(user: User): Promise<User> {
    const userRef = doc(this.usersCol, user.id ?? undefined);
    
        const newUser: User = {
          ...user,
          id: userRef.id,
          created_date: new Date(),
          updated_date: new Date(),
        };
    
        await setDoc(userRef, {
          ...newUser,
          created_date: serverTimestamp(),
          updated_date: serverTimestamp(),
        });
    
        return newUser;
  }

  async getAllUser(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async getByIdUser(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async updateUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
