import { useCallback, useEffect, useState } from "react";
import { SQLiteUserRepository } from "../../data/repositories/sqliteUserRepository";
import { User } from "../../domain/models/User";
import { CreateUser } from "../../domain/usecases/user/CreateUser";
import { DeleteUser } from "../../domain/usecases/user/DeleteUser";
import { GetUsers } from "../../domain/usecases/user/GetUsers";

const userRepository = new SQLiteUserRepository();
const getUsersUseCase = new GetUsers(userRepository);
const createUserUseCase = new CreateUser(userRepository);
const deleteUserUseCase = new DeleteUser(userRepository);

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsersUseCase.execute();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateUser = useCallback(async (user: Omit<User, "id">) => {
    try {
      await createUserUseCase.execute(user);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  }, [fetchUsers]);

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      await deleteUserUseCase.execute(id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers, handleCreateUser, handleDeleteUser };
};
