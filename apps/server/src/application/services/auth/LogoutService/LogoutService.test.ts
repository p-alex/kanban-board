import { describe, it, expect, vi, beforeEach } from "vitest";
import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import FindSessionUsecase from "../../../usecases/session/FindSessionUsecase/FindSessionUsecase.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import LogoutService from "./LogoutService.js";

const mockRun = vi.fn();
const mockFindSession = {
  execute: vi.fn(),
};
const mockSessionRepository = {
  deleteByToken: vi.fn(),
};

let logoutService: LogoutService;

beforeEach(() => {
  vi.clearAllMocks();

  const transactionManager = {
    run: mockRun,
  } as unknown as TransactionManager;

  logoutService = new LogoutService(
    transactionManager,
    mockFindSession as unknown as FindSessionUsecase,
    mockSessionRepository as unknown as SessionRepository
  );
});

describe("LogoutService", () => {
  const userId = "user-123";
  const refreshToken = "refresh-token-abc";

  const mockSession = {
    token: refreshToken,
    user_id: userId,
    created_at: "2025-07-09T12:00:00.000Z",
  };

  it("should logout successfully when session exists and user_id matches", async () => {
    mockFindSession.execute.mockResolvedValue(mockSession);
    mockSessionRepository.deleteByToken.mockResolvedValue(undefined);
    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    const result = await logoutService.execute(userId, refreshToken);

    expect(result).toBeUndefined();

    expect(mockFindSession.execute).toHaveBeenCalledWith(
      refreshToken,
      "mock-query"
    );
    expect(mockSessionRepository.deleteByToken).toHaveBeenCalledWith(
      refreshToken,
      {
        transactionQuery: "mock-query",
      }
    );
  });

  it("should throw AppException(401) if session is not found", async () => {
    mockFindSession.execute.mockResolvedValue(null);
    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(logoutService.execute(userId, refreshToken)).rejects.toThrow(
      AppException
    );
    await expect(
      logoutService.execute(userId, refreshToken)
    ).rejects.toMatchObject({
      code: 401,
      errors: ["Cannot logout because there is no session"],
    });

    expect(mockFindSession.execute).toHaveBeenCalledWith(
      refreshToken,
      "mock-query"
    );
    expect(mockSessionRepository.deleteByToken).not.toHaveBeenCalled();
  });

  it("should throw AppException(401) if session.user_id does not match", async () => {
    const mismatchedSession = { ...mockSession, user_id: "another-user" };
    mockFindSession.execute.mockResolvedValue(mismatchedSession);
    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(logoutService.execute(userId, refreshToken)).rejects.toThrow(
      AppException
    );
    await expect(
      logoutService.execute(userId, refreshToken)
    ).rejects.toMatchObject({
      code: 401,
      errors: ["Not allowed"],
    });

    expect(mockFindSession.execute).toHaveBeenCalledWith(
      refreshToken,
      "mock-query"
    );
    expect(mockSessionRepository.deleteByToken).not.toHaveBeenCalled();
  });

  it("should propagate errors from FindSessionUsecase", async () => {
    const error = new Error("FindSession failed");
    mockFindSession.execute.mockRejectedValue(error);
    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(logoutService.execute(userId, refreshToken)).rejects.toThrow(
      error
    );

    expect(mockFindSession.execute).toHaveBeenCalledWith(
      refreshToken,
      "mock-query"
    );
  });

  it("should propagate errors from SessionRepository.deleteByToken", async () => {
    mockFindSession.execute.mockResolvedValue(mockSession);
    mockSessionRepository.deleteByToken.mockRejectedValue(
      new Error("Delete failed")
    );
    mockRun.mockImplementation(async (fn: any) => {
      return await fn("mock-query");
    });

    await expect(logoutService.execute(userId, refreshToken)).rejects.toThrow(
      "Delete failed"
    );

    expect(mockSessionRepository.deleteByToken).toHaveBeenCalledWith(
      refreshToken,
      {
        transactionQuery: "mock-query",
      }
    );
  });

  it("should call transactionManager.run with a function", async () => {
    mockRun.mockImplementation(async (fn: any) => {
      expect(typeof fn).toBe("function");
      return "logout-success";
    });

    const result = await logoutService.execute(userId, refreshToken);

    expect(result).toBe("logout-success");
    expect(mockRun).toHaveBeenCalled();
  });
});
