import { useFirestore } from "@/_src/data/db/DataBaseContext";
import { DbUserRepository } from "@/_src/data/repositories/dbUserRepository";
import { User } from "@/_src/domain/models/User";
import { CreateUserUseCase } from "@/_src/usecases/user/CreateUserUseCase";
import { useState } from "react";

export const useUsers = () => {
  const db = useFirestore();
  const userRepository = new DbUserRepository(db);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (user: User) => {
    try {
      await createUserUseCase.execute(user);
      setUsers([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };  

  return {
    users,
    loading,
    error,
    handleCreateUser
  };
}

