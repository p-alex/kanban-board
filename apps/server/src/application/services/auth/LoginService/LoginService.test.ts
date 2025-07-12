import { describe, it, expect, vi, beforeEach } from "vitest";
import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import VerifyLoginCredentialsUsecase from "../../../usecases/auth/VerifyLoginCredentialsUsecase/VerifyLoginCredentialsUsecase.js";
import CreateAccessTokenUsecase from "../../../usecases/auth/CreateAccessTokenUsecase/CreateAccessTokenUsecase.js";
import CreateRefreshTokenUsecase from "../../../usecases/auth/CreateRefreshTokenUsecase/CreateRefreshTokenUsecase.js";
import CreateSessionUsecase from "../../../usecases/session/CreateSessionUsecase/CreateSessionUsecase.js";
import { UserToDto } from "../../../../domain/user/userToDto.js";
import { LoginRequestDto } from "@kanban/dtos/AuthDtoTypes";
import LoginService from "./LoginService.js";
import IUser from "../../../../domain/user/IUser.js";

const mockRun = vi.fn();
const mockVerifyLoginCredentials = {
  execute: vi.fn(),
};
const mockCreateAccessToken = {
  execute: vi.fn(),
};
const mockCreateRefreshToken = {
  execute: vi.fn(),
};
const mockCreateSession = {
  execute: vi.fn(),
};
const mockUserToDto = vi.fn();

let loginService: LoginService;

beforeEach(() => {
  vi.clearAllMocks();

  const transactionManager = {
    run: mockRun,
  } as unknown as TransactionManager;

  loginService = new LoginService(
    transactionManager,
    mockVerifyLoginCredentials as unknown as VerifyLoginCredentialsUsecase,
    mockCreateAccessToken as unknown as CreateAccessTokenUsecase,
    mockCreateRefreshToken as unknown as CreateRefreshTokenUsecase,
    mockCreateSession as unknown as CreateSessionUsecase,
    mockUserToDto as unknown as UserToDto
  );
});

describe("LoginService", () => {
  const credentials: LoginRequestDto = {
    email: "test@example.com",
    password: "password123",
  };

  const mockUser: IUser = {
    id: "user-123",
    username: "johndoe",
    encrypted_email: "encrypted@example.com",
    hashed_email: "hashed@example.com",
    password: "hashedpassword",
    is_verified: true,
    created_at: "2025-07-09T12:00:00.000Z",
  };

  const mockAccessToken = "mock-access-token";
  const mockRefreshToken = "mock-refresh-token";
  const mockUserDto = {
    id: mockUser.id,
    username: mockUser.username,
    email: "decrypted@example.com",
  };

  it("should execute login flow and return userDto, accessToken, and refreshToken", async () => {
    mockVerifyLoginCredentials.execute.mockResolvedValue(mockUser);
    mockCreateAccessToken.execute.mockResolvedValue(mockAccessToken);
    mockCreateRefreshToken.execute.mockResolvedValue(mockRefreshToken);
    mockCreateSession.execute.mockResolvedValue(undefined);
    mockUserToDto.mockReturnValue(mockUserDto);

    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    const result = await loginService.execute(credentials);

    expect(result).toEqual({
      userDto: mockUserDto,
      refreshToken: mockRefreshToken,
      accessToken: mockAccessToken,
    });

    expect(mockVerifyLoginCredentials.execute).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
      "mock-query"
    );
    expect(mockCreateAccessToken.execute).toHaveBeenCalledWith(mockUser.id);
    expect(mockCreateRefreshToken.execute).toHaveBeenCalledWith(mockUser.id);
    expect(mockCreateSession.execute).toHaveBeenCalledWith(
      mockUser.id,
      mockRefreshToken,
      "mock-query"
    );
    expect(mockUserToDto).toHaveBeenCalledWith(mockUser);
  });

  it("should propagate errors from verifyLoginCredentials", async () => {
    const error = new Error("Invalid credentials");
    mockVerifyLoginCredentials.execute.mockRejectedValue(error);

    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(loginService.execute(credentials)).rejects.toThrow(error);

    expect(mockVerifyLoginCredentials.execute).toHaveBeenCalled();
  });

  it("should propagate errors from createAccessToken", async () => {
    mockVerifyLoginCredentials.execute.mockResolvedValue(mockUser);
    mockCreateAccessToken.execute.mockRejectedValue(new Error("Token error"));

    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(loginService.execute(credentials)).rejects.toThrow(
      "Token error"
    );

    expect(mockCreateAccessToken.execute).toHaveBeenCalledWith(mockUser.id);
  });

  it("should propagate errors from createSession", async () => {
    mockVerifyLoginCredentials.execute.mockResolvedValue(mockUser);
    mockCreateAccessToken.execute.mockResolvedValue(mockAccessToken);
    mockCreateRefreshToken.execute.mockResolvedValue(mockRefreshToken);
    mockCreateSession.execute.mockRejectedValue(
      new Error("Session creation failed")
    );

    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(loginService.execute(credentials)).rejects.toThrow(
      "Session creation failed"
    );

    expect(mockCreateSession.execute).toHaveBeenCalledWith(
      mockUser.id,
      mockRefreshToken,
      "mock-query"
    );
  });

  it("should call transactionManager.run with a function", async () => {
    mockRun.mockImplementation(async (fn: any) => {
      expect(typeof fn).toBe("function");
      return "result";
    });

    const result = await loginService.execute(credentials);

    expect(result).toBe("result");
    expect(mockRun).toHaveBeenCalled();
  });
});
