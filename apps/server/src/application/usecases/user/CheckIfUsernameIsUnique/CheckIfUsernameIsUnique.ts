import { QueryDb } from "../../../../db/index.js";
import AppException from "../../../../exceptions/AppException.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";

class CheckIfUsernameIsUnique {
  constructor(private readonly _userRepository: UserRepository) {}

  execute = async (username: string, transactionQuery?: QueryDb) => {
    const user = await this._userRepository.findByUsername(username, {
      transactionQuery,
    });
    if (user) {
      throw new AppException(
        401,
        ["A user with that username already exists."],
        "CheckIfUsernameIsUnique"
      );
    }
  };
}

export default CheckIfUsernameIsUnique;
