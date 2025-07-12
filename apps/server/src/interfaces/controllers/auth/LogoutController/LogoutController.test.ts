import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import {
  httpRequestFactory,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import LogoutController from "./LogoutController.js";
import LogoutService from "../../../../application/services/auth/LogoutService/LogoutService.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import { SESSION_COOKIE_NAME } from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";

describe("Logout.ts", () => {
  let mockHttpReq: IHttpRequest;
  let logoutService: Mocked<LogoutService>;
  let httpResponseFactory: Mocked<HttpResponseFactory>;
  let logoutController: LogoutController;

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();

    logoutService = { execute: vi.fn() } as unknown as Mocked<LogoutService>;

    httpResponseFactory = {
      success: vi.fn(),
    } as unknown as Mocked<HttpResponseFactory>;

    logoutController = new LogoutController(logoutService, httpResponseFactory);
  });

  it("should call logout service with the correct arguments", async () => {
    await logoutController.handle(mockHttpReq);

    expect(logoutService.execute).toHaveBeenCalledWith(
      mockHttpReq.user?.id,
      mockHttpReq.cookies["session"]
    );
  });

  it("should return a cookie configured correctly", async () => {
    const result = await logoutController.handle(mockHttpReq);

    expect(result.cookies).toEqual([
      {
        httpOnly: true,
        maxAgeInMs: 0,
        name: SESSION_COOKIE_NAME,
        sameSite: "strict",
        secure: true,
        value: "",
      },
    ]);
  });

  it("should return the correct object", async () => {
    const httpResponseReturn: IHttpResponse<null> = {
      code: 200,
      errors: [],
      result: null,
      success: true,
    };

    httpResponseFactory.success.mockReturnValue(httpResponseReturn);

    const result = await logoutController.handle(mockHttpReq);

    expect(result).toEqual({
      response: httpResponseReturn,
      cookies: [
        {
          httpOnly: true,
          maxAgeInMs: 0,
          name: SESSION_COOKIE_NAME,
          sameSite: "strict",
          secure: true,
          value: "",
        },
      ],
    });
  });
});
