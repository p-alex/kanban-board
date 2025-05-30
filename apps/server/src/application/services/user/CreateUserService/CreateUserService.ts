import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import SendAccountVerificationEmailUsecase from "../../../usecases/email/SendAccountVerificationEmailUsecase.js";
import CheckIfEmailIsUnique from "../../../usecases/user/CheckIfEmailIsUnique/CheckIfEmailIsUnique.js";
import CheckIfUsernameIsUnique from "../../../usecases/user/CheckIfUsernameIsUnique/CheckIfUsernameIsUnique.js";
import CreateUserUsecase from "../../../usecases/user/CreateUser/CreateUserUsecase.js";
import CreateVerificationCodeUsecase from "../../../usecases/verificationCode/CreateVerificationCode/CreateVerificationCodeUsecase.js";
import { UserToDto } from "../../../../domain/user/userToDto.js";

class CreateUserService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _checkIfUsernameIsUnique: CheckIfUsernameIsUnique,
    private readonly _checkIfEmailIsUnique: CheckIfEmailIsUnique,
    private readonly _createUser: CreateUserUsecase,
    private readonly _createVerificationCode: CreateVerificationCodeUsecase,
    private readonly _sendAccountVerificationEmail: SendAccountVerificationEmailUsecase,
    private readonly _userToDto: UserToDto
  ) {}

  execute = async (
    userData: CreateUserRequestDto
  ): Promise<CreateUserResponseDto> => {
    return await this._transactionManager.run(async (query) => {
      await this._checkIfUsernameIsUnique.execute(userData.username, query);

      await this._checkIfEmailIsUnique.execute(userData.email, query);

      const createdUser = await this._createUser.execute(userData, query);

      const code = await this._createVerificationCode.execute(
        createdUser.id,
        "user_verification",
        query
      );

      await this._sendAccountVerificationEmail.execute(code, userData.email);

      return { userDto: this._userToDto(createdUser) };
    });
  };
}

export default CreateUserService;
