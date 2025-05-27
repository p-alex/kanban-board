import { CreateUserRequestDto, UserDto } from "@kanban/dtos/UserDtoTypes";
import { SendAccountVerificationEmailUsecase } from "../../usecases/email/index.js";
import UserRepository from "../../../infrastructure/repositories/user/UserRepository.js";
import UserFactory from "../../../domain/user/UserFactory.js";
import IUser from "../../../domain/user/IUser.js";
import VerificationCodeFactory from "../../../domain/verificationCode/VerificationCodeFactory.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import VerificationCodeRepository from "../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import TransactionManager from "../../../db/TransactionManager/TransactionManager.js";
import AppException from "../../../exceptions/AppException.js";

class UserService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _userRepository: UserRepository,
    private readonly _verificationCodeRepository: VerificationCodeRepository,
    private readonly _userFactory: UserFactory,
    private readonly _verificationCodeFactory: VerificationCodeFactory,
    private readonly _sendAccountVerificationEmail: SendAccountVerificationEmailUsecase,
    private readonly _crypto: CryptoUtil,
    private readonly _date: DateUtil
  ) {}

  create = async (
    userData: CreateUserRequestDto
  ): Promise<{ userDto: UserDto }> => {
    return await this._transactionManager.run(async (query) => {
      const userWithUsername = await this._userRepository.findByUsername(
        userData.username,
        { transactionQuery: query }
      );

      if (userWithUsername)
        throw new AppException(400, "A user with that username already exists");

      const userWithEmail = await this._userRepository.findByEmail(
        this._crypto.sha256(userData.email),
        { transactionQuery: query }
      );

      if (userWithEmail)
        throw new AppException(400, "A user with that email already exists");

      const newUser = await this._userFactory.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      const createdUser = await this._userRepository.create(newUser, {
        transactionQuery: query,
      });

      const code = this._crypto.generateCode(8);

      const emailVerificationCode = this._verificationCodeFactory.create(
        createdUser.id,
        code,
        "email_verification"
      );

      await this._verificationCodeRepository.create(emailVerificationCode, {
        transactionQuery: query,
      });

      await this._sendAccountVerificationEmail(code, userData.email);

      return { userDto: this._fromUserToDto(createdUser) };
    });
  };

  verifyEmail = async (code: string) => {
    return await this._transactionManager.run(async (query) => {
      const hashedCode = this._crypto.sha256(code);

      const verificationCode =
        await this._verificationCodeRepository.findByCode(hashedCode, {
          transactionQuery: query,
        });

      if (!verificationCode) {
        throw new AppException(404, "Verification code does not exist");
      }

      if (verificationCode.type !== "email_verification")
        throw new AppException(401, "Invalid verification code");

      if (this._date.isDateInThePast(verificationCode.expires_at)) {
        await this._verificationCodeRepository.deleteByCode(hashedCode);
        throw new AppException(401, "Verification code is expired");
      }

      const user = await this._userRepository.findById(
        verificationCode.user_id
      );

      if (!user)
        throw new AppException(
          404,
          "Verification code is associated to a user that does not exist"
        );

      if (user.is_verified === true)
        throw new AppException(401, "User is already verified");

      const updatedUser: IUser = { ...user, is_verified: true };

      await this._userRepository.update(updatedUser, {
        transactionQuery: query,
      });

      await this._verificationCodeRepository.deleteByCode(hashedCode);
    });
  };

  private _fromUserToDto(user: IUser): UserDto {
    return {
      id: user.id,
      username: user.username,
    };
  }
}

export default UserService;
