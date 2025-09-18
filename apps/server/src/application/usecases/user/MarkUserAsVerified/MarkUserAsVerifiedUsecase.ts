import { QueryDb } from "../../../../db/index.js";
import IUser from "../../../../domain/user/IUser.js";
import AppException from "../../../../exceptions/AppException.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";

class MarkUserAsVerifiedUsecase {
  constructor(private readonly _userRepository: UserRepository) {}

  execute = async (id: string, transactionQuery?: QueryDb) => {
    const user = await this._userRepository.findById(id, { transactionQuery });

    if (!user)
      throw new AppException(
        404,
        ["Couldn't mark user as verified because it does not exist"],
        "MarkUserAsVerifiedUsecase"
      );

    if (user.is_verified)
      throw new AppException(
        401,
        ["User is already verified"],
        "MarkUserAsVerifiedUsecase"
      );

    const updatedUser: IUser = { ...user, is_verified: true };

    await this._userRepository.update(updatedUser, {
      transactionQuery,
    });

    return updatedUser;
  };
}

export default MarkUserAsVerifiedUsecase;
