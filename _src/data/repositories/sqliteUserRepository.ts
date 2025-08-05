import { User } from "../../domain/models/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { getDB } from "../db";

export class SQLiteUserRepository implements IUserRepository {
  async createUser(user: Omit<User, "id">): Promise<User> {
    const db = await getDB();
    const result = await db.runAsync("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email]);
    if (result.lastInsertRowId) {
      return { ...user};
    }
    throw new Error("Failed to create user.");
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDB();
    const result = await db.getAllAsync<User>("SELECT * FROM users");
    return result;
  }

  async getByIdUser(id: string): Promise<User | null> {
    const db = await getDB();
    const result = await db.getFirstAsync<User>("SELECT * FROM users WHERE id = ?", [id]);
    return result || null;
  }

  async updateUser(user: User): Promise<void> {
    const db = await getDB();
    if(!user.id) {
        return;
    } else {
        await db.runAsync("UPDATE users SET name = ?, email = ? WHERE id = ?", [user.name, user.email, user.id]);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const db = await getDB();
    await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
  }
}