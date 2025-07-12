import { describe, it, expect, vi, beforeEach } from "vitest";
import { JwtUtil } from "@kanban/utils";
import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";
import CreateRefreshTokenUsecase from "./CreateRefreshTokenUsecase.js";

describe("CreateRefreshTokenUsecase", () => {
  const mockJwtUtil = {
    sign: vi.fn(),
  } as unknown as JwtUtil;

  const refreshTokenSecret = "test-refresh-token-secret";
  const usecase = new CreateRefreshTokenUsecase(
    mockJwtUtil,
    refreshTokenSecret
  );

  const userId = "user-123";
  const fakeRefreshToken = "fake.refresh.token";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call JwtUtil.sign with correct payload, secret, and expiration", async () => {
    mockJwtUtil.sign = vi.fn().mockResolvedValue(fakeRefreshToken);

    const result = await usecase.execute(userId);

    expect(mockJwtUtil.sign).toHaveBeenCalledWith(
      { id: userId },
      refreshTokenSecret,
      SESSION_EXPIRE_TIME_IN_MS
    );

    expect(result).toBe(fakeRefreshToken);
  });

  it("should propagate errors from JwtUtil.sign", async () => {
    const error = new Error("sign failed");
    mockJwtUtil.sign = vi.fn().mockRejectedValue(error);

    await expect(usecase.execute(userId)).rejects.toThrow("sign failed");
  });
});
