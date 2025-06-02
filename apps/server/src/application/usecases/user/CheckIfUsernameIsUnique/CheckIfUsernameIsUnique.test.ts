import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import { userFixture } from "../../../../__fixtures__/user/index.js";
import CheckIfUsernameIsUnique from "./CheckIfUsernameIsUnique.js";
import AppException from "../../../../exceptions/AppException.js";

describe("CheckIfUsernameIsUnique.ts", () => {
  let userRepositoryMock: Mocked<UserRepository>;

  let checkIfUsernameIsUnique: CheckIfUsernameIsUnique;

  beforeEach(() => {
    userRepositoryMock = {
      findByUsername: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    checkIfUsernameIsUnique = new CheckIfUsernameIsUnique(userRepositoryMock);
  });

  it("should hash the email with hmacSHA256 before finding user", async () => {
    await checkIfUsernameIsUnique.execute("username");

    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith("username", {
      transactionQuery: undefined,
    });
  });

  it("should throw app exception correctly if a user with the same email is found", async () => {
    userRepositoryMock.findByUsername.mockResolvedValue(userFixture);

    try {
      await checkIfUsernameIsUnique.execute("username");
    } catch (error) {
      if (error instanceof AppException) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe(
          "A user with that username already exists."
        );
      }
    }
  });
});
