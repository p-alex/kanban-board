import refreshSessionService from "../../../../application/services/auth/RefreshSessionService/index.js";
import createRefreshTokenCookie from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import RefreshSessionController from "./RefreshSessionController.js";

const refreshSessionController = new RefreshSessionController(
  refreshSessionService,
  createRefreshTokenCookie,
  httpResponseFactory
);

export default refreshSessionController;
