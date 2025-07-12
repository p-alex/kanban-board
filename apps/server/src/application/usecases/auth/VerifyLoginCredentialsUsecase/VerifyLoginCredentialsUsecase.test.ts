import { describe, it, expect, vi, beforeEach } from "vitest";
import { CryptoUtil } from "@kanban/utils";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import IUser from "../../../../domain/user/IUser.js";
import VerifyLoginCredentialsUsecase from "./VerifyLoginCredentialsUsecase.js";

describe("VerifyLoginCredentialsUsecase", () => {
  const mockCrypto = {
    hmacSHA256: vi.fn(),
    verifySlowHash: vi.fn(),
  } as unknown as CryptoUtil;

  const mockUserRepository = {
    findByEmail: vi.fn(),
  } as unknown as UserRepository;

  const emailHashSecret = "test-email-hash-secret";

  const usecase = new VerifyLoginCredentialsUsecase(
    mockCrypto,
    emailHashSecret,
    mockUserRepository
  );

  const email = "user@example.com";
  const password = "plaintext-password";
  const hashedPassword = "hashed-password";
  const hashedEmail = "hashed-email";

  const mockUser: IUser = {
    id: "user-123",
    username: "testuser",
    encrypted_email: "encrypted",
    hashed_email: hashedEmail,
    password: hashedPassword,
    is_verified: true,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should hash the email, find user, verify password, and return user on success", async () => {
    mockCrypto.hmacSHA256 = vi.fn().mockReturnValue(hashedEmail);
    mockUserRepository.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockCrypto.verifySlowHash = vi.fn().mockResolvedValue(true);

    const result = await usecase.execute(email, password);

    expect(mockCrypto.hmacSHA256).toHaveBeenCalledWith(email, emailHashSecret);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(hashedEmail, {
      transactionQuery: undefined,
    });
    expect(mockCrypto.verifySlowHash).toHaveBeenCalledWith(
      password,
      mockUser.password
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw AppException if user not found", async () => {
    mockCrypto.hmacSHA256 = vi.fn().mockReturnValue(hashedEmail);
    mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);

    await expect(usecase.execute(email, password)).rejects.toMatchObject(
      new AppException(401, ["Invalid email or password"])
    );

    expect(mockCrypto.verifySlowHash).not.toHaveBeenCalled();
  });

  it("should throw AppException if account is not verified", async () => {
    const unverifiedUser = { ...mockUser, is_verified: false };
    mockCrypto.hmacSHA256 = vi.fn().mockReturnValue(hashedEmail);
    mockUserRepository.findByEmail = vi.fn().mockResolvedValue(unverifiedUser);

    await expect(usecase.execute(email, password)).rejects.toMatchObject(
      new AppException(401, ["Account not verified."])
    );

    expect(mockCrypto.verifySlowHash).not.toHaveBeenCalled();
  });

  it("should throw AppException if password verification fails", async () => {
    mockCrypto.hmacSHA256 = vi.fn().mockReturnValue(hashedEmail);
    mockUserRepository.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockCrypto.verifySlowHash = vi.fn().mockResolvedValue(false);

    await expect(usecase.execute(email, password)).rejects.toMatchObject(
      new AppException(401, ["Invalid email or password"])
    );
  });
});
