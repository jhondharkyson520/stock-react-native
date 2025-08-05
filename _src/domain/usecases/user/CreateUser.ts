import { User } from "../../models/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: Omit<User, "id">): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
