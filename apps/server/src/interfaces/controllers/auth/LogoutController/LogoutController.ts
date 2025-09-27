import LogoutService from "../../../../application/services/auth/LogoutService/LogoutService.js";
import { SESSION_COOKIE_NAME } from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import {
  ICookie,
  IHandlerResponse,
  IHttpRequest,
} from "../../../adapter/index.js";

class LogoutController {
  constructor(
    private readonly _logoutService: LogoutService,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (httpReq: IHttpRequest): Promise<IHandlerResponse<null>> => {
    await this._logoutService.execute(
      httpReq.auth_user!.id,
      httpReq.cookies[SESSION_COOKIE_NAME]
    );

    const expiredSessionCookie: ICookie = {
      httpOnly: true,
      maxAgeInMs: 0,
      name: SESSION_COOKIE_NAME,
      sameSite: "strict",
      secure: true,
      value: "",
    };

    return {
      response: this._httpResponseFactory.success(200, null),
      cookies: [expiredSessionCookie],
    };
  };
}

export default LogoutController;
