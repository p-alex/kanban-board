import { RefreshSessionResponseDto } from "@kanban/dtos/AuthDtoTypes";
import RefreshSessionService from "../../../../application/services/auth/RefreshSessionService/RefreshSessionService.js";
import CreateRefreshTokenCookieUsecase, {
  SESSION_COOKIE_NAME,
} from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";
import AppException from "../../../../exceptions/AppException.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class RefreshSessionController {
  constructor(
    private readonly _refreshSessionService: RefreshSessionService,
    private readonly _createRefreshTokenCookie: CreateRefreshTokenCookieUsecase,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest
  ): Promise<IHandlerResponse<RefreshSessionResponseDto>> => {
    const refreshToken = httpReq.cookies[SESSION_COOKIE_NAME];

    if (!refreshToken)
      throw new AppException(401, ["No refresh token provided"]);

    const { userDto, newAccessToken, newRefreshToken } =
      await this._refreshSessionService.execute(refreshToken);

    const newRefreshTokenCookie =
      this._createRefreshTokenCookie.execute(newRefreshToken);

    return {
      response: this._httpResponseFactory.success(200, {
        userDto,
        newAccessToken,
      }),
      cookies: [newRefreshTokenCookie],
    };
  };
}

export default RefreshSessionController;
