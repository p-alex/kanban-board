import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";
import { ICookie } from "../../../../interfaces/adapter/index.js";

export const SESSION_COOKIE_NAME = "session";

class CreateRefreshTokenCookieUsecase {
  constructor(private readonly _domain: string) {}

  execute = (refreshToken: string): ICookie => {
    return {
      name: SESSION_COOKIE_NAME,
      httpOnly: true,
      maxAgeInMs: SESSION_EXPIRE_TIME_IN_MS,
      sameSite: "strict",
      secure: true,
      value: refreshToken,
      domain: this._domain,
      path: "/",
    };
  };
}

export default CreateRefreshTokenCookieUsecase;
