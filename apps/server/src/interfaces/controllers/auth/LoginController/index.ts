import loginService from "../../../../application/services/auth/LoginService/index.js";
import createRefreshTokenCookie from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import LoginController from "./LoginController.js";

const loginController = new LoginController(
  loginService,
  createRefreshTokenCookie,
  httpResponseFactory
);

export default loginController;
