import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";
import SessionFactory from "../../../../domain/session/SessionFactory.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import CreateSessionUsecase from "./CreateSessionUsecase.js";
import { QueryDb } from "../../../../db/index.js";
import { sessionMock } from "../../../../domain/session/index.js";

describe("CreateSessionUsecase.ts", () => {
  let sessionFactory: Mocked<SessionFactory>;
  let sessionRepository: Mocked<SessionRepository>;

  let createSessionUsecase: CreateSessionUsecase;

  beforeEach(() => {
    sessionFactory = {
      create: vi.fn().mockReturnValue(sessionMock),
    } as unknown as Mocked<SessionFactory>;
    sessionRepository = {
      create: vi.fn().mockResolvedValue(sessionMock),
    } as unknown as Mocked<SessionRepository>;

    createSessionUsecase = new CreateSessionUsecase(
      sessionFactory,
      sessionRepository
    );
  });

  it("should call session factory correctly", async () => {
    await createSessionUsecase.execute("userId", "refreshToken");
    expect(sessionFactory.create).toHaveBeenCalledWith(
      "userId",
      "refreshToken"
    );
  });

  it("should call sessionRepository's create function correctly", async () => {
    await createSessionUsecase.execute("userId", "refreshToken");
    expect(sessionRepository.create).toHaveBeenCalledWith(sessionMock, {
      transactionQuery: undefined,
    });
  });

  it("should pass transaction query if it is not undefined to sessionReposity.create function", async () => {
    const queryMock = vi.fn() as Mocked<QueryDb>;
    await createSessionUsecase.execute("userId", "refreshToken", queryMock);
    expect(sessionRepository.create).toHaveBeenCalledWith(sessionMock, {
      transactionQuery: queryMock,
    });
  });

  it("should return correct result", async () => {
    const result = await createSessionUsecase.execute("userId", "refreshToken");
    expect(result).toEqual(sessionMock);
  });
});
