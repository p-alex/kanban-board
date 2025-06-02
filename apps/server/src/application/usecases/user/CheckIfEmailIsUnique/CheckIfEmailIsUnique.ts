import { QueryDb } from "../../../../db/index.js";
import AppException from "../../../../exceptions/AppException.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import { CryptoUtil } from "@kanban/utils";

class CheckIfEmailIsUnique {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _crypto: CryptoUtil,
    private readonly _emailHashSecret: string
  ) {}

  execute = async (email: string, transactionQuery?: QueryDb) => {
    const hashedEmail = this._crypto.hmacSHA256(email, this._emailHashSecret);
    const user = await this._userRepository.findByEmail(hashedEmail, {
      transactionQuery,
    });
    if (user) {
      throw new AppException(401, ["A user with that email already exists."]);
    }
  };
}

export default CheckIfEmailIsUnique;
