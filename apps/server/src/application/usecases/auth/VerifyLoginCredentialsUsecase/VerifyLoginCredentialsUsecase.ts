import { CryptoUtil } from "@kanban/utils";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import { QueryDb } from "../../../../db/index.js";
import AppException from "../../../../exceptions/AppException.js";

class VerifyLoginCredentialsUsecase {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _emailHashSecret: string,
    private readonly _userRepository: UserRepository
  ) {}

  execute = async (
    email: string,
    password: string,
    transactionQuery?: QueryDb
  ) => {
    const emailHash = this._crypto.hmacSHA256(email, this._emailHashSecret);

    const user = await this._userRepository.findByEmail(emailHash, {
      transactionQuery,
    });

    if (!user)
      throw new AppException(
        401,
        ["Invalid email or password"],
        "VerifyLoginCredentialsUsecase"
      );

    if (!user.is_verified)
      throw new AppException(
        401,
        ["Account not verified."],
        "VerifyLoginCredentialsUsecase"
      );

    const isValidPassword = await this._crypto.verifySlowHash(
      password,
      user.password
    );

    if (!isValidPassword)
      throw new AppException(
        401,
        ["Invalid email or password"],
        "VerifyLoginCredentialsUsecase"
      );

    return user;
  };
}

export default VerifyLoginCredentialsUsecase;
