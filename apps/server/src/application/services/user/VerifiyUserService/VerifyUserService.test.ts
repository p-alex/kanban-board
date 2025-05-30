import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import VerifiyUserService from "./VerifiyUserService.js";
import CheckVerificationCodeUsecase from "../../../usecases/verificationCode/CheckVerificationCode/CheckVerificationCodeUsecase.js";
import MarkUserAsVerifiedUsecase from "../../../usecases/user/MarkUserAsVerified/MarkUserAsVerifiedUsecase.js";
import { verificationCodeFixture } from "../../../../__fixtures__/verificationCode/index.js";
import { userFixture } from "../../../../__fixtures__/user/index.js";

describe("VerifyUserService.ts", () => {
  let transactionManagerMock: Mocked<TransactionManager>;
  const mockRun = vi.fn();
  let checkVerificationCodeMock: Mocked<CheckVerificationCodeUsecase>;
  let markUserAsVerifiedMock: Mocked<MarkUserAsVerifiedUsecase>;
  let verificationCodeRepositoryMock: Mocked<VerificationCodeRepository>;

  let verifyUserService: VerifiyUserService;

  beforeEach(() => {
    transactionManagerMock = {
      run: mockRun,
    } as unknown as Mocked<TransactionManager>;

    checkVerificationCodeMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CheckVerificationCodeUsecase>;

    markUserAsVerifiedMock = {
      execute: vi.fn(),
    } as unknown as Mocked<MarkUserAsVerifiedUsecase>;

    verificationCodeRepositoryMock = {
      deleteById: vi.fn(),
    } as unknown as Mocked<VerificationCodeRepository>;

    verifyUserService = new VerifiyUserService(
      transactionManagerMock,
      checkVerificationCodeMock,
      markUserAsVerifiedMock,
      verificationCodeRepositoryMock
    );
  });

  it("should verify user correctly", async () => {
    mockRun.mockImplementation(async (work) => {
      return await work({});
    });

    checkVerificationCodeMock.execute.mockResolvedValue(
      verificationCodeFixture
    );

    markUserAsVerifiedMock.execute.mockResolvedValue(userFixture);

    await verifyUserService.execute("123");

    expect(checkVerificationCodeMock.execute).toHaveBeenCalledWith(
      "123",
      "user_verification",
      {}
    );

    expect(markUserAsVerifiedMock.execute).toHaveBeenCalledWith(
      verificationCodeFixture.user_id,
      {}
    );

    expect(verificationCodeRepositoryMock.deleteById).toHaveBeenCalledWith(
      verificationCodeFixture.id,
      { transactionQuery: {} }
    );
  });
});
