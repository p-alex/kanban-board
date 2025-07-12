import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import { sessionMock } from "../../../../domain/session/index.js";
import FindSessionUsecase from "./FindSessionUsecase.js";
import { QueryDb } from "../../../../db/index.js";

describe("FindSessionUsecase.ts", () => {
  const sessionHashSecret = "secret";

  let hmacSHA256: Mock;
  let sessionRepositoy: Mocked<SessionRepository>;
  let findSessionUsecase: FindSessionUsecase;
  const hmacResult = "hash";

  beforeEach(() => {
    hmacSHA256 = vi.fn().mockReturnValue(hmacResult);
    sessionRepositoy = {
      findByToken: vi.fn().mockResolvedValue(sessionMock),
    } as unknown as Mocked<SessionRepository>;
    findSessionUsecase = new FindSessionUsecase(
      hmacSHA256,
      sessionHashSecret,
      sessionRepositoy
    );
  });

  it("should call hmacSHA256 function correctly", async () => {
    await findSessionUsecase.execute("refreshToken");
    expect(hmacSHA256).toHaveBeenCalledWith("refreshToken", sessionHashSecret);
  });

  it("should call sessionRepository.create correctly", async () => {
    await findSessionUsecase.execute("refreshToken");
    expect(sessionRepositoy.findByToken).toHaveBeenCalledWith(hmacResult, {
      transactionQuery: undefined,
    });
  });

  it("should call sessionRepository.create with transactionQuery if provided", async () => {
    const queryMock = vi.fn() as Mocked<QueryDb>;
    await findSessionUsecase.execute("refreshToken", queryMock);
    expect(sessionRepositoy.findByToken).toHaveBeenCalledWith(hmacResult, {
      transactionQuery: queryMock,
    });
  });

  it("should return a session", async () => {
    const result = await findSessionUsecase.execute("refreshToken");
    expect(result).toEqual(sessionMock);
  });
});
