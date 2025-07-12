import transactionManager from "../../../../db/TransactionManager/index.js";
import userToDto from "../../../../domain/user/userToDto.js";
import createAccessToken from "../../../usecases/auth/CreateAccessTokenUsecase/index.js";
import createRefreshToken from "../../../usecases/auth/CreateRefreshTokenUsecase/index.js";
import verifyLoginCredentialsUsecase from "../../../usecases/auth/VerifyLoginCredentialsUsecase/index.js";
import createSessionUsecase from "../../../usecases/session/CreateSessionUsecase/index.js";
import LoginService from "./LoginService.js";

const loginService = new LoginService(
  transactionManager,
  verifyLoginCredentialsUsecase,
  createAccessToken,
  createRefreshToken,
  createSessionUsecase,
  userToDto
);

export default loginService;
