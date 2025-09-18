import { describe, it, expect, vi, beforeEach } from "vitest";
import { DateUtil, JwtUtil, TimeConverter } from "@kanban/utils";
import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";
import CreateRefreshTokenUsecase from "./CreateRefreshTokenUsecase.js";

describe("CreateRefreshTokenUsecase", () => {
  const mockJwtUtil = {
    sign: vi.fn(),
  } as unknown as JwtUtil;

  let time: TimeConverter;
  let date: DateUtil;

  const refreshTokenSecret = "test-refresh-token-secret";
  let createRefreshTokenUsecase: CreateRefreshTokenUsecase;

  const userId = "user-123";
  const fakeRefreshToken = "fake.refresh.token";

  beforeEach(() => {
    vi.resetAllMocks();
    time = {
      toSeconds: vi.fn().mockReturnValue(3245632),
    } as unknown as TimeConverter;

    date = {
      now: vi.fn().mockReturnValue(3245632),
    } as unknown as DateUtil;

    createRefreshTokenUsecase = new CreateRefreshTokenUsecase(
      mockJwtUtil,
      refreshTokenSecret,
      time,
      date
    );
  });

  it("should call JwtUtil.sign with correct payload, secret, and expiration", async () => {
    mockJwtUtil.sign = vi.fn().mockResolvedValue(fakeRefreshToken);

    const result = await createRefreshTokenUsecase.execute(userId);

    expect(mockJwtUtil.sign).toHaveBeenCalledWith(
      { id: userId },
      refreshTokenSecret,
      3245632 + 3245632
    );

    expect(result).toBe(fakeRefreshToken);
  });

  it("should propagate errors from JwtUtil.sign", async () => {
    const error = new Error("sign failed");
    mockJwtUtil.sign = vi.fn().mockRejectedValue(error);

    await expect(createRefreshTokenUsecase.execute(userId)).rejects.toThrow(
      "sign failed"
    );
  });
});
