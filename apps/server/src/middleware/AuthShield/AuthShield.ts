import AppException from "../../exceptions/AppException.js";
import {
  IHandlerResponse,
  IHttpRequest,
} from "../../interfaces/adapter/index.js";
import { JwtUtil } from "@kanban/utils";
import { IAuthenticatedUser } from "./index.js";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";

type ProtectArgs = {
  letThroughAnyway?: boolean;
};

class AuthShield {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _accessTokenJwtSecret: string,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  protect =
    ({ letThroughAnyway = false }: ProtectArgs) =>
    async (httpReq: IHttpRequest): Promise<IHandlerResponse<null>> => {
      const accessToken = httpReq.accessToken;

      try {
        const authenticatedUser = await this._jwt.verify<IAuthenticatedUser>(
          accessToken,
          this._accessTokenJwtSecret
        );

        return {
          response: this._httpResponseFactory.success(200, null),
          authenticatedUser: authenticatedUser,
        };
      } catch (error) {
        if (letThroughAnyway)
          return {
            response: this._httpResponseFactory.success(200, null),
            authenticatedUser: null,
          };
        throw new AppException(
          401,
          ["Invalid token or expired."],
          "AuthShield"
        );
      }
    };
}

export default AuthShield;
