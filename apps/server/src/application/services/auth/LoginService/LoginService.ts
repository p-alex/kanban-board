import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import { UserToDto } from "../../../../domain/user/userToDto.js";
import { LoginRequestDto } from "@kanban/dtos/AuthDtoTypes";
import VerifyLoginCredentialsUsecase from "../../../usecases/auth/VerifyLoginCredentialsUsecase/VerifyLoginCredentialsUsecase.js";
import CreateAccessTokenUsecase from "../../../usecases/auth/CreateAccessTokenUsecase/CreateAccessTokenUsecase.js";
import CreateRefreshTokenUsecase from "../../../usecases/auth/CreateRefreshTokenUsecase/CreateRefreshTokenUsecase.js";
import CreateSessionUsecase from "../../../usecases/session/CreateSessionUsecase/CreateSessionUsecase.js";

class LoginService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _verifyLoginCredentials: VerifyLoginCredentialsUsecase,
    private readonly _createAccessToken: CreateAccessTokenUsecase,
    private readonly _createRefreshToken: CreateRefreshTokenUsecase,
    private readonly _createSession: CreateSessionUsecase,
    private readonly _userToDto: UserToDto
  ) {}

  execute = async (credentials: LoginRequestDto) => {
    return await this._transactionManager.run(async (query) => {
      const user = await this._verifyLoginCredentials.execute(
        credentials.email,
        credentials.password,
        query
      );

      const accessToken = await this._createAccessToken.execute(user.id);

      const refreshToken = await this._createRefreshToken.execute(user.id);

      await this._createSession.execute(user.id, refreshToken, query);

      return {
        userDto: this._userToDto(user),
        refreshToken,
        accessToken,
      };
    });
  };
}

export default LoginService;
