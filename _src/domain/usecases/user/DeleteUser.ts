import { IUserRepository } from "../../repositories/IUserRepository";

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }
}
