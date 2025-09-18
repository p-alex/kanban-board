import AppException from "../../exceptions/AppException.js";
import {
  IHandlerResponse,
  IHttpRequest,
} from "../../interfaces/adapter/index.js";
import { JwtUtil } from "@kanban/utils";
import { IAuthenticatedUser } from "./index.js";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";

class AuthShield {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _accessTokenJwtSecret: string,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  protect = async (httpReq: IHttpRequest): Promise<IHandlerResponse<null>> => {
    try {
      const accessToken = httpReq.accessToken;

      if (!accessToken)
        throw new AppException(401, ["Must be logged in"], "AuthShield");

      const authenticatedUser = await this._jwt.verify<IAuthenticatedUser>(
        accessToken,
        this._accessTokenJwtSecret
      );

      return {
        response: this._httpResponseFactory.success(200, null),
        authenticatedUser,
      };
    } catch (error) {
      console.error(error);
      throw new AppException(
        401,
        ["Invalid or expired access token"],
        "AuthShield"
      );
    }
  };
}

export default AuthShield;
