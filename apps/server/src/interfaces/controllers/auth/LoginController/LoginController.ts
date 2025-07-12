import { LoginRequestDto, LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";
import LoginService from "../../../../application/services/auth/LoginService/LoginService.js";
import {
  ICookie,
  IHandlerResponse,
  IHttpRequest,
} from "../../../adapter/index.js";
import CreateRefreshTokenCookieUsecase from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class LoginController {
  constructor(
    private readonly _loginService: LoginService,
    private readonly _createRefreshTokenCookie: CreateRefreshTokenCookieUsecase,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<LoginRequestDto>
  ): Promise<IHandlerResponse<LoginResponseDto>> => {
    const { email, password } = httpReq.body;

    const { userDto, refreshToken, accessToken } =
      await this._loginService.execute({ email, password });

    const refreshTokenCookie: ICookie =
      this._createRefreshTokenCookie.execute(refreshToken);

    return {
      response: this._httpResponseFactory.success(200, {
        userDto,
        accessToken,
      }),
      cookies: [refreshTokenCookie],
    };
  };
}

export default LoginController;
