import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import {
  httpRequestFactory,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import RefreshSessionController from "./RefreshSessionController.js";
import RefreshSessionService from "../../../../application/services/auth/RefreshSessionService/RefreshSessionService.js";
import CreateRefreshTokenCookieUsecase, {
  SESSION_COOKIE_NAME,
} from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import AppException from "../../../../exceptions/AppException.js";

describe("RefreshSessionController.ts", () => {
  let mockHttpReq: IHttpRequest;
  let refreshSessionService: Mocked<RefreshSessionService>;
  let createRefreshTokenCookie: Mocked<CreateRefreshTokenCookieUsecase>;
  let httpResponseFactory: Mocked<HttpResponseFactory>;
  let refreshSessionController: RefreshSessionController;

  const refreshToken = "test-refresh-token";

  const serviceResponse = {
    userDto: { id: "id", username: "username" },
    newAccessToken: "newAccessToken",
    newRefreshToken: "newRefreshToken",
  };

  const newCookie = {
    httpOnly: true,
    maxAgeInMs: 1000,
    name: SESSION_COOKIE_NAME,
    sameSite: "strict",
    secure: true,
    value: "newRefreshToken",
  };

  const httpResponseReturn: IHttpResponse<{
    userDto: typeof serviceResponse.userDto;
    newAccessToken: string;
  }> = {
    code: 200,
    errors: [],
    result: {
      userDto: serviceResponse.userDto,
      newAccessToken: serviceResponse.newAccessToken,
    },
    success: true,
  };

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    mockHttpReq.cookies[SESSION_COOKIE_NAME] = refreshToken;

    refreshSessionService = {
      execute: vi.fn().mockResolvedValue(serviceResponse),
    } as unknown as Mocked<RefreshSessionService>;

    createRefreshTokenCookie = {
      execute: vi.fn().mockReturnValue(newCookie),
    } as unknown as Mocked<CreateRefreshTokenCookieUsecase>;

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(httpResponseReturn),
    } as unknown as Mocked<HttpResponseFactory>;

    refreshSessionController = new RefreshSessionController(
      refreshSessionService,
      createRefreshTokenCookie,
      httpResponseFactory
    );
  });

  it("should call refreshSessionService with correct refresh token", async () => {
    await refreshSessionController.handle(mockHttpReq);

    expect(refreshSessionService.execute).toHaveBeenCalledWith(refreshToken);
  });

  it("should call createRefreshTokenCookie with correct arguments", async () => {
    await refreshSessionController.handle(mockHttpReq);

    expect(createRefreshTokenCookie.execute).toHaveBeenCalledWith(
      serviceResponse.newRefreshToken
    );
  });

  it("should return the correct handler response", async () => {
    const result = await refreshSessionController.handle(mockHttpReq);

    expect(result).toEqual({
      response: httpResponseReturn,
      cookies: [newCookie],
    });
  });

  it("should throw AppException if no refresh token is provided", async () => {
    delete mockHttpReq.cookies[SESSION_COOKIE_NAME];

    await expect(() =>
      refreshSessionController.handle(mockHttpReq)
    ).rejects.toThrow(AppException);

    await expect(
      refreshSessionController.handle(mockHttpReq)
    ).rejects.toMatchObject({
      code: 401,
      errors: ["No refresh token provided"],
    });
  });
});
