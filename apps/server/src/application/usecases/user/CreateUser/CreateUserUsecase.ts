import { CreateUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import { QueryDb } from "../../../../db/index.js";
import UserFactory from "../../../../domain/user/UserFactory.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";

class CreateUserUsecase {
  constructor(
    private readonly _userFactory: UserFactory,
    private readonly _userRepository: UserRepository
  ) {}

  execute = async (
    userData: CreateUserRequestDto,
    transactionQuery?: QueryDb
  ) => {
    const newUser = await this._userFactory.create(userData);

    const createdUser = await this._userRepository.create(newUser, {
      transactionQuery,
    });

    return createdUser;
  };
}

export default CreateUserUsecase;
