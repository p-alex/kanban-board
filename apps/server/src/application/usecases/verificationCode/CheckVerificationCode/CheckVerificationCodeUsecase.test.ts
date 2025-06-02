import { afterEach, describe, expect, it, Mocked, vi } from "vitest";
import CheckVerificationCodeUsecase from "./CheckVerificationCodeUsecase.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import { verificationCodeFixture } from "../../../../__fixtures__/verificationCode/index.js";

describe("CheckVerificationCodeUsecase.ts", () => {
  let cryptoMock = {
    hmacSHA256: vi.fn(() => "hash"),
  } as unknown as Mocked<CryptoUtil>;

  let verificationCodeRepositoryMock = {
    findByCode: vi.fn(),
    deleteByCode: vi.fn(),
  } as unknown as Mocked<VerificationCodeRepository>;

  const verificationCodeHashSecret = "verification_code_hash_secret";

  let dateMock = {
    isDateInThePast: vi.fn(),
  } as unknown as Mocked<DateUtil>;

  let checkVerificationCode = new CheckVerificationCodeUsecase(
    cryptoMock,
    verificationCodeRepositoryMock,
    verificationCodeHashSecret,
    dateMock
  );

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should throw AppException if no verification code was found", async () => {
    verificationCodeRepositoryMock.findByCode.mockResolvedValue(undefined);

    try {
      await checkVerificationCode.execute("code", "user_verification");
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);

      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe("Invalid code");
      }
    }
  });

  it("should throw AppException if verification code is of any type other than the correct one", async () => {
    verificationCodeRepositoryMock.findByCode.mockResolvedValue({
      ...verificationCodeFixture,
      // @ts-ignore
      type: "other_type",
    });

    try {
      await checkVerificationCode.execute("code", "user_verification");
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);

      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe("Invalid code");
      }
    }
  });

  it("should throw AppException if verification code is expired", async () => {
    verificationCodeRepositoryMock.findByCode.mockResolvedValue(
      verificationCodeFixture
    );

    dateMock.isDateInThePast.mockReturnValue(true);

    try {
      await checkVerificationCode.execute("code", "user_verification");
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);

      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe(
          "Code expired. Log in again to trigger another account verification process."
        );
      }
    }
  });

  it("should delete verification code if it is expired", async () => {
    verificationCodeRepositoryMock.findByCode.mockResolvedValue(
      verificationCodeFixture
    );

    dateMock.isDateInThePast.mockReturnValue(true);

    try {
      await checkVerificationCode.execute("code", "user_verification");

      expect(verificationCodeRepositoryMock.deleteByCode).toHaveBeenCalledWith(
        "code",
        { transactionQuery: undefined }
      );
    } catch (error) {}
  });

  it("should handle successfull verification code check correctly", async () => {
    verificationCodeRepositoryMock.findByCode.mockResolvedValue(
      verificationCodeFixture
    );

    dateMock.isDateInThePast.mockReturnValue(false);

    const result = await checkVerificationCode.execute(
      "code",
      "user_verification"
    );

    expect(cryptoMock.hmacSHA256).toHaveBeenCalledWith(
      "code",
      verificationCodeHashSecret
    );

    expect(verificationCodeRepositoryMock.findByCode).toHaveBeenCalledWith(
      "hash",
      { transactionQuery: undefined }
    );

    expect(verificationCodeRepositoryMock.deleteByCode).not.toHaveBeenCalled();

    expect(result).toEqual(verificationCodeFixture);
  });
});
