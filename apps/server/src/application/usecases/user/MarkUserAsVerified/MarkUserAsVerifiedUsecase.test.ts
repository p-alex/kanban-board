import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import MarkUserAsVerified from "./MarkUserAsVerifiedUsecase.js";
import AppException from "../../../../exceptions/AppException.js";
import { userFixture } from "../../../../__fixtures__/user/index.js";
import IUser from "../../../../domain/user/IUser.js";

describe("MarkUserAsVerified.ts", () => {
  let userRepositoryMock: Mocked<UserRepository>;

  let markUserAsVerified: MarkUserAsVerified;

  beforeEach(() => {
    userRepositoryMock = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    markUserAsVerified = new MarkUserAsVerified(userRepositoryMock);
  });

  it("should throw AppException if a user cannot be found", async () => {
    userRepositoryMock.findById.mockResolvedValue(undefined);

    try {
      await markUserAsVerified.execute("id");
    } catch (error) {
      if (error instanceof AppException) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe(404);
        expect(error.errors[0]).toBe(
          "Couldn't mark user as verified because it does not exist"
        );
      }
    }
  });

  it("should throw AppException if user is already verified", async () => {
    userRepositoryMock.findById.mockResolvedValue({
      ...userFixture,
      is_verified: true,
    });

    try {
      await markUserAsVerified.execute("id");
    } catch (error) {
      if (error instanceof AppException) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe("User is already verified");
      }
    }
  });

  it("should mark a user as verified successfully", async () => {
    userRepositoryMock.findById.mockResolvedValue(userFixture);

    const result = await markUserAsVerified.execute("id");

    expect(userRepositoryMock.findById).toHaveBeenCalledWith("id", {
      transactionQuery: undefined,
    });

    const updatedUser: IUser = { ...userFixture, is_verified: true };

    expect(userRepositoryMock.update).toHaveBeenCalledWith(updatedUser, {
      transactionQuery: undefined,
    });

    expect(result).toEqual(updatedUser);
  });
});
