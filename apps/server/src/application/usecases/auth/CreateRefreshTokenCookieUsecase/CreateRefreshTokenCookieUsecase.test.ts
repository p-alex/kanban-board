import { describe, it, expect } from "vitest";

import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";
import { ICookie } from "../../../../interfaces/adapter/index.js";
import CreateRefreshTokenCookieUsecase, {
  SESSION_COOKIE_NAME,
} from "./CreateRefreshTokenCookieUsecase.js";

describe("CreateRefreshTokenCookieUsecase", () => {
  const domain = "example.com";
  const refreshToken = "test-refresh-token";

  const expectedBaseCookie: Omit<ICookie, "maxAgeInMs"> = {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    value: refreshToken,
    domain,
    path: "/",
  };

  it("should create a cookie with default maxAge when maxAgeInMs is not provided", () => {
    const usecase = new CreateRefreshTokenCookieUsecase(domain);

    const cookie = usecase.execute(refreshToken);

    expect(cookie).toEqual({
      ...expectedBaseCookie,
      maxAgeInMs: SESSION_EXPIRE_TIME_IN_MS,
    });
  });
});
