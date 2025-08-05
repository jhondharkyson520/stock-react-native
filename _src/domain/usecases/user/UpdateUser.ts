import { User } from "../../models/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<void> {
    return this.userRepository.updateUser(user);
  }
}
