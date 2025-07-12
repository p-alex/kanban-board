import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateAccessTokenUsecase from "../../../usecases/auth/CreateAccessTokenUsecase/CreateAccessTokenUsecase.js";
import CreateRefreshTokenUsecase from "../../../usecases/auth/CreateRefreshTokenUsecase/CreateRefreshTokenUsecase.js";
import VerifySessionUsecase from "../../../usecases/auth/VerifySessionUsecase/VerifySessionUsecase.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import { UserToDto } from "../../../../domain/user/userToDto.js";
import ISession from "../../../../domain/session/ISession.js";
import RefreshSessionService from "./RefreshSessionService.js";

const mockCreateAccessToken = { execute: vi.fn() };
const mockCreateRefreshToken = { execute: vi.fn() };
const mockVerifySession = { execute: vi.fn() };
const mockSessionRepository = { update: vi.fn() };
const mockCrypto = { hmacSHA256: vi.fn() };
const mockDateUtil = {
  dateStringToMs: vi.fn(),
  now: vi.fn(),
};
const mockUserToDto = vi.fn();

const refreshTokenHashSecret = "secret-key";

let refreshSessionService: RefreshSessionService;

beforeEach(() => {
  vi.clearAllMocks();

  refreshSessionService = new RefreshSessionService(
    mockCreateAccessToken as unknown as CreateAccessTokenUsecase,
    mockCreateRefreshToken as unknown as CreateRefreshTokenUsecase,
    mockVerifySession as unknown as VerifySessionUsecase,
    mockSessionRepository as unknown as SessionRepository,
    mockCrypto as unknown as CryptoUtil,
    refreshTokenHashSecret,
    mockUserToDto as unknown as UserToDto,
    mockDateUtil as unknown as DateUtil
  );
});

describe("RefreshSessionService", () => {
  const inputRefreshToken = "old-refresh-token";
  const newAccessToken = "new-access-token";
  const newRefreshToken = "new-refresh-token";
  const hashedNewRefreshToken = "hashed-new-refresh-token";

  const mockUser = {
    id: "user-123",
    username: "testuser",
    encrypted_email: "encrypted@example.com",
    hashed_email: "hashed@example.com",
    password: "hashedpassword",
    is_verified: true,
    created_at: "2025-07-09T12:00:00.000Z",
  };

  const mockSession: ISession = {
    id: "id",
    last_accessed_at: "2025-07-09T12:00:00.000Z",
    token: "old-session-token",
    user_id: mockUser.id,
    created_at: "2025-07-09T12:00:00.000Z",
    expires_at: "2025-07-19T12:00:00.000Z",
  };

  it("should refresh session and return new tokens with userDto", async () => {
    mockVerifySession.execute.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });
    mockCreateAccessToken.execute.mockResolvedValue(newAccessToken);
    mockCreateRefreshToken.execute.mockResolvedValue(newRefreshToken);
    mockCrypto.hmacSHA256.mockReturnValue(hashedNewRefreshToken);
    mockSessionRepository.update.mockResolvedValue(undefined);
    mockUserToDto.mockReturnValue({
      id: mockUser.id,
      username: mockUser.username,
    });
    mockDateUtil.dateStringToMs.mockReturnValue(200000);
    mockDateUtil.now.mockReturnValue(100000);

    const result = await refreshSessionService.execute(inputRefreshToken);

    expect(mockVerifySession.execute).toHaveBeenCalledWith(inputRefreshToken);
    expect(mockCreateAccessToken.execute).toHaveBeenCalledWith(mockUser.id);
    expect(mockCreateRefreshToken.execute).toHaveBeenCalledWith(mockUser.id);
    expect(mockCrypto.hmacSHA256).toHaveBeenCalledWith(
      newRefreshToken,
      refreshTokenHashSecret
    );

    expect(mockSessionRepository.update).toHaveBeenCalledWith(
      { ...mockSession, token: hashedNewRefreshToken },
      {}
    );

    expect(mockDateUtil.dateStringToMs).toHaveBeenCalledWith(
      mockSession.expires_at
    );
    expect(mockDateUtil.now).toHaveBeenCalled();

    expect(result).toEqual({
      userDto: { id: mockUser.id, username: mockUser.username },
      newAccessToken,
      newRefreshToken,
      newRefreshTokenCookieMaxAgeInMs: 100000,
    });
  });

  it("should propagate errors from VerifySessionUsecase", async () => {
    const error = new Error("Session verification failed");
    mockVerifySession.execute.mockRejectedValue(error);

    await expect(
      refreshSessionService.execute(inputRefreshToken)
    ).rejects.toThrow(error);

    expect(mockVerifySession.execute).toHaveBeenCalledWith(inputRefreshToken);
  });

  it("should propagate errors from CreateAccessTokenUsecase", async () => {
    mockVerifySession.execute.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });
    mockCreateAccessToken.execute.mockRejectedValue(
      new Error("Access token error")
    );

    await expect(
      refreshSessionService.execute(inputRefreshToken)
    ).rejects.toThrow("Access token error");
  });

  it("should propagate errors from CreateRefreshTokenUsecase", async () => {
    mockVerifySession.execute.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });
    mockCreateAccessToken.execute.mockResolvedValue(newAccessToken);
    mockCreateRefreshToken.execute.mockRejectedValue(
      new Error("Refresh token error")
    );

    await expect(
      refreshSessionService.execute(inputRefreshToken)
    ).rejects.toThrow("Refresh token error");
  });

  it("should propagate errors from SessionRepository.update", async () => {
    mockVerifySession.execute.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });
    mockCreateAccessToken.execute.mockResolvedValue(newAccessToken);
    mockCreateRefreshToken.execute.mockResolvedValue(newRefreshToken);
    mockCrypto.hmacSHA256.mockReturnValue(hashedNewRefreshToken);
    mockSessionRepository.update.mockRejectedValue(new Error("Update error"));

    await expect(
      refreshSessionService.execute(inputRefreshToken)
    ).rejects.toThrow("Update error");
  });
});
