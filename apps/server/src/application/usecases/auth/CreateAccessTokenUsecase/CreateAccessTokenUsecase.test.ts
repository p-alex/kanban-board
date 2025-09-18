import { describe, it, expect, vi, beforeEach } from "vitest";
import { JwtUtil, DateUtil, TimeConverter } from "@kanban/utils";
import CreateAccessTokenUsecase from "./CreateAccessTokenUsecase.js";

// Mock dependencies
const mockJwt = { sign: vi.fn() };
const mockDateUtil = { now: vi.fn() };
const mockTimeConverter = { toSeconds: vi.fn() };
const accessTokenSecret = "access-token-secret";

let createAccessTokenUsecase: CreateAccessTokenUsecase;

beforeEach(() => {
  vi.clearAllMocks();

  createAccessTokenUsecase = new CreateAccessTokenUsecase(
    mockJwt as unknown as JwtUtil,
    accessTokenSecret,
    mockTimeConverter as unknown as TimeConverter,
    mockDateUtil as unknown as DateUtil
  );
});

describe("CreateAccessTokenUsecase", () => {
  const userId = "user-123";
  const fakeIssuedAtMs = 1620000000000;
  const issuedAtSeconds = 1620000000;
  const expiryTimeInSec = 1;
  const expireAtSeconds = issuedAtSeconds + expiryTimeInSec;
  const signedToken = "signed.jwt.token";

  it("should sign a JWT with correct payload, secret, and 15-minute expiration", async () => {
    mockDateUtil.now.mockReturnValue(fakeIssuedAtMs);
    mockTimeConverter.toSeconds
      .mockImplementationOnce((val, unit) => {
        expect(val).toBe(fakeIssuedAtMs);
        expect(unit).toBe("milisecond");
        return issuedAtSeconds;
      })
      .mockImplementationOnce((val, unit) => {
        expect(val).toBe(1);
        expect(unit).toBe("second");
        return expiryTimeInSec;
      });

    mockJwt.sign.mockResolvedValue(signedToken);

    const result = await createAccessTokenUsecase.execute(userId);

    expect(mockDateUtil.now).toHaveBeenCalled();
    expect(mockTimeConverter.toSeconds).toHaveBeenCalledWith(
      fakeIssuedAtMs,
      "milisecond"
    );
    expect(mockTimeConverter.toSeconds).toHaveBeenCalledWith(1, "second");

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: userId },
      accessTokenSecret,
      expireAtSeconds
    );

    expect(result).toBe(signedToken);
  });

  it("should propagate errors from JwtUtil.sign", async () => {
    mockDateUtil.now.mockReturnValue(fakeIssuedAtMs);
    mockTimeConverter.toSeconds
      .mockReturnValueOnce(issuedAtSeconds)
      .mockReturnValueOnce(expiryTimeInSec);

    const signError = new Error("JWT signing failed");
    mockJwt.sign.mockRejectedValue(signError);

    await expect(createAccessTokenUsecase.execute(userId)).rejects.toThrow(
      signError
    );

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: userId },
      accessTokenSecret,
      expireAtSeconds
    );
  });
});
