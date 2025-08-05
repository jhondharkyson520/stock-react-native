import { User } from "../../models/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class GetUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }
}
