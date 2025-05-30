import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import VerificationCodeFactory from "../../../../domain/verificationCode/VerificationCodeFactory.js";
import { CryptoUtil } from "@kanban/utils";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import { verificationCodeFixture } from "../../../../__fixtures__/verificationCode/index.js";
import CreateVerificationCodeUsecase from "./CreateVerificationCodeUsecase.js";

describe("CreateVerificationCodeUsecase.ts", () => {
  const cryptoMock = {
    generateCode: vi.fn(),
  } as unknown as Mocked<CryptoUtil>;

  const verificationCodeFactoryMock = {
    create: vi.fn().mockReturnValue(verificationCodeFixture),
  } as unknown as Mocked<VerificationCodeFactory>;

  const verificationCodeRepositoryMock = {
    create: vi.fn(),
  } as unknown as Mocked<VerificationCodeRepository>;

  let createVerificationCode: CreateVerificationCodeUsecase;

  beforeEach(() => {
    createVerificationCode = new CreateVerificationCodeUsecase(
      cryptoMock,
      verificationCodeFactoryMock,
      verificationCodeRepositoryMock
    );
  });

  it("should create a verification code correctly", async () => {
    const code = "12345678";

    cryptoMock.generateCode.mockReturnValue(code);

    await createVerificationCode.execute("user_id", "user_verification");

    expect(cryptoMock.generateCode).toHaveBeenCalledWith(8);

    expect(verificationCodeFactoryMock.create).toHaveBeenCalledWith(
      "user_id",
      code,
      "user_verification"
    );

    expect(verificationCodeRepositoryMock.create).toHaveBeenCalledWith(
      verificationCodeFixture,
      { transactionQuery: undefined }
    );
  });
});
