import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginService from "../../../../application/services/auth/LoginService/LoginService.js";
import CreateRefreshTokenCookieUsecase from "../../../../application/usecases/auth/CreateRefreshTokenCookieUsecase/CreateRefreshTokenCookieUsecase.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import LoginController from "./LoginController.js";
import {
  httpRequestFactory,
  ICookie,
  IHandlerResponse,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import { UserDto } from "@kanban/dtos/UserDtoTypes";
import { LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";

describe("LoginController.ts", () => {
  let mockHttpReq: IHttpRequest;
  let loginService: LoginService;
  let createRefreshTokenCookie: CreateRefreshTokenCookieUsecase;
  let httpResponseFactory: HttpResponseFactory;
  let loginController: LoginController;

  const loginServiceResponse: Awaited<ReturnType<LoginService["execute"]>> = {
    userDto: { id: "id", username: "username" },
    accessToken: "accessToken",
    refreshToken: "refreshToken",
  };

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    loginService = {
      execute: vi.fn().mockResolvedValue(loginServiceResponse),
    } as unknown as LoginService;

    const refreshTokenCookie: ICookie = {
      httpOnly: true,
      maxAgeInMs: 0,
      name: "session",
      sameSite: "strict",
      secure: true,
      value: "session",
    };

    createRefreshTokenCookie = {
      execute: vi.fn().mockReturnValue(refreshTokenCookie),
    } as unknown as CreateRefreshTokenCookieUsecase;

    const mockHttpResponse: IHttpResponse<{
      userDto: UserDto;
      accessToken: string;
    }> = {
      code: 200,
      errors: [],
      result: {
        userDto: loginServiceResponse.userDto,
        accessToken: loginServiceResponse.accessToken,
      },
      success: true,
    };

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as HttpResponseFactory;

    loginController = new LoginController(
      loginService,
      createRefreshTokenCookie,
      httpResponseFactory
    );
  });

  it("should call loginService with correct arguments", async () => {
    await loginController.handle(mockHttpReq);

    expect(loginService.execute).toHaveBeenCalledWith({
      email: mockHttpReq.body.email,
      password: mockHttpReq.body.password,
    });
  });

  it("should call createRefreshTokenCookie with correct arguments", async () => {
    await loginController.handle(mockHttpReq);

    expect(createRefreshTokenCookie.execute).toHaveBeenCalledWith(
      loginServiceResponse.refreshToken
    );
  });

  it("should return the correct response", async () => {
    const result = await loginController.handle(mockHttpReq);

    const handlerResponse: IHandlerResponse<LoginResponseDto> = {
      response: {
        code: 200,
        errors: [],
        result: {
          accessToken: "accessToken",
          userDto: {
            id: "id",
            username: "username",
          },
        },
        success: true,
      },
      cookies: [
        {
          httpOnly: true,
          maxAgeInMs: 0,
          name: "session",
          sameSite: "strict",
          secure: true,
          value: "session",
        },
      ],
    };

    expect(result).toEqual(handlerResponse);
  });
});
