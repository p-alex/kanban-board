import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { CryptoUtil } from "@kanban/utils";
import CheckIfEmailIsUnique from "./CheckIfEmailIsUnique.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import { userFixture } from "../../../../__fixtures__/user/index.js";
import { QueryDb } from "../../../../db/index.js";
import AppException from "../../../../exceptions/AppException.js";

describe("CheckIfEmailIsUnique.ts", () => {
  let cryptoMock: Mocked<CryptoUtil>;
  let userRepo: Mocked<UserRepository>;
  let queryDbMock: Mocked<QueryDb>;

  const emailHashSecret = "email_hash_secret";

  let checkIfEmailIsUnique: CheckIfEmailIsUnique;

  beforeEach(() => {
    cryptoMock = {
      hmacSHA256: vi.fn(),
    } as unknown as Mocked<CryptoUtil>;

    userRepo = {
      findByEmail: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    checkIfEmailIsUnique = new CheckIfEmailIsUnique(
      userRepo,
      cryptoMock,
      emailHashSecret
    );

    queryDbMock = vi.fn();
  });

  it("should hash the email with hmacSHA256 before finding user", async () => {
    cryptoMock.hmacSHA256.mockReturnValue("hashedEmail");

    await checkIfEmailIsUnique.execute("email");

    expect(cryptoMock.hmacSHA256).toHaveBeenCalledWith(
      "email",
      emailHashSecret
    );

    expect(userRepo.findByEmail).toHaveBeenCalledWith("hashedEmail", {
      transactionQuery: undefined,
    });
  });

  it("should throw app exception correctly if a user with the same email is found", async () => {
    cryptoMock.hmacSHA256.mockReturnValue("hashedEmail");

    userRepo.findByEmail.mockResolvedValue(userFixture);

    try {
      await checkIfEmailIsUnique.execute("email");
    } catch (error) {
      if (error instanceof AppException) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe("A user with that email already exists.");
      }
    }
  });
});
