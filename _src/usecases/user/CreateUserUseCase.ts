import { User } from "@/_src/domain/models/User";
import { IUserRepository } from "@/_src/domain/repositories/IUserRepository";


export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
