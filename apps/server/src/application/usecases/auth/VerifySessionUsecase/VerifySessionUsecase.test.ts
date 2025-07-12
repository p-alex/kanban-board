import { vi, describe, it, expect, beforeEach } from "vitest";
import VerifySessionUsecase from "./VerifySessionUsecase.js";
import AppException from "../../../../exceptions/AppException.js";

// Mocks for dependencies
const mockJwt = {
  verify: vi.fn(),
};
const mockFindSession = {
  execute: vi.fn(),
};
const mockUserRepository = {
  findById: vi.fn(),
};
const mockDate = {
  dateStringToMs: vi.fn(),
  now: vi.fn(),
};
const mockSessionRepository = {
  deleteByToken: vi.fn(),
};

describe("VerifySessionUsecase", () => {
  let usecase: VerifySessionUsecase;
  const secret = "refresh-secret";

  beforeEach(() => {
    vi.clearAllMocks();
    usecase = new VerifySessionUsecase(
      mockJwt as any,
      secret,
      mockFindSession as any,
      mockUserRepository as any,
      mockDate as any,
      mockSessionRepository as any
    );
  });

  it("throws if no refresh token provided", async () => {
    await expect(usecase.execute("")).rejects.toThrow(AppException);
    await expect(usecase.execute("")).rejects.toMatchObject({
      code: 401,
      errors: ["No refresh token provided"],
    });
  });

  it("throws if jwt.verify throws (invalid token)", async () => {
    mockJwt.verify.mockRejectedValue(new Error("invalid token"));

    await expect(usecase.execute("token")).rejects.toThrow(Error);
  });

  it("throws if session not found", async () => {
    mockJwt.verify.mockResolvedValue({ id: "user1" });
    mockFindSession.execute.mockResolvedValue(null);

    await expect(usecase.execute("token")).rejects.toThrow(AppException);
    await expect(usecase.execute("token")).rejects.toMatchObject({
      code: 401,
      errors: ["Invalid refresh token"],
    });
  });

  it("throws and deletes session if expired", async () => {
    const session = {
      token: "session-token",
      expires_at: "2023-01-01T00:00:00.000Z",
    };
    mockJwt.verify.mockResolvedValue({ id: "user1" });
    mockFindSession.execute.mockResolvedValue(session);
    mockDate.dateStringToMs.mockReturnValue(1000);
    mockDate.now.mockReturnValue(2000); // now > expires_at => expired
    mockSessionRepository.deleteByToken.mockResolvedValue(undefined);

    await expect(usecase.execute("token")).rejects.toThrow(AppException);
    expect(mockSessionRepository.deleteByToken).toHaveBeenCalledWith(
      session.token,
      {}
    );
  });

  it("throws and deletes session if user not found", async () => {
    const session = {
      token: "session-token",
      expires_at: "2999-01-01T00:00:00.000Z",
    };
    mockJwt.verify.mockResolvedValue({ id: "user1" });
    mockFindSession.execute.mockResolvedValue(session);
    mockDate.dateStringToMs.mockReturnValue(9999999999);
    mockDate.now.mockReturnValue(1000); // now < expires_at => valid
    mockUserRepository.findById.mockResolvedValue(null);
    mockSessionRepository.deleteByToken.mockResolvedValue(undefined);

    await expect(usecase.execute("token")).rejects.toThrow(AppException);
    expect(mockSessionRepository.deleteByToken).toHaveBeenCalledWith(
      session.token,
      {}
    );
  });

  it("returns user and session if valid", async () => {
    const session = {
      token: "session-token",
      expires_at: "2999-01-01T00:00:00.000Z",
      user_id: "user1",
    };
    const user = { id: "user1", username: "tester" };
    mockJwt.verify.mockResolvedValue({ id: "user1" });
    mockFindSession.execute.mockResolvedValue(session);
    mockDate.dateStringToMs.mockReturnValue(9999999999);
    mockDate.now.mockReturnValue(1000);
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await usecase.execute("token");

    expect(result).toEqual({ user, session });
  });
});
