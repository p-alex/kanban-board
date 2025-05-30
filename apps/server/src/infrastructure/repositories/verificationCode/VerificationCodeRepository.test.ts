import { describe, it, expect, vi, beforeEach } from "vitest";
import VerificationCodeRepository from "./VerificationCodeRepository.js";
import { verificationCodeFixture } from "../../../__fixtures__/verificationCode/index.js";

describe("VerificationCodeRepository", () => {
  let mockQueryDB: any;
  let repository: VerificationCodeRepository;

  beforeEach(() => {
    mockQueryDB = vi.fn();
    repository = new VerificationCodeRepository(mockQueryDB);
  });

  describe("findByCode", () => {
    it("should call default queryDB with correct SQL and parameters", async () => {
      const fakeCode = "hashed-code";

      mockQueryDB.mockResolvedValueOnce([verificationCodeFixture]);

      const result = await repository.findByCode(fakeCode);

      expect(mockQueryDB).toHaveBeenCalledWith(
        "SELECT * FROM verification_codes WHERE code = $1",
        [fakeCode]
      );
      expect(result).toEqual(verificationCodeFixture);
    });

    it("should return undefined if no result is found", async () => {
      const fakeCode = "non-existent-code";
      mockQueryDB.mockResolvedValueOnce([]);

      const result = await repository.findByCode(fakeCode);

      expect(result).toBeUndefined();
    });

    it("should use transactionQuery if provided in options", async () => {
      const fakeCode = "hashed-code";
      const mockTransactionQuery = vi.fn();

      mockTransactionQuery.mockResolvedValueOnce([verificationCodeFixture]);

      const result = await repository.findByCode(fakeCode, {
        transactionQuery: mockTransactionQuery,
      });

      expect(mockTransactionQuery).toHaveBeenCalledWith(
        "SELECT * FROM verification_codes WHERE code = $1",
        [fakeCode]
      );
      expect(result).toEqual(verificationCodeFixture);
    });
  });

  describe("create", () => {
    it("should insert a verification code and return the result", async () => {
      mockQueryDB.mockResolvedValueOnce([verificationCodeFixture]);

      const result = await repository.create(verificationCodeFixture);

      expect(mockQueryDB).toHaveBeenCalledWith(
        "INSERT INTO verification_codes (id, user_id, code, type, created_at, expires_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          verificationCodeFixture.id,
          verificationCodeFixture.user_id,
          verificationCodeFixture.code,
          verificationCodeFixture.type,
          verificationCodeFixture.created_at,
          verificationCodeFixture.expires_at,
        ]
      );
      expect(result).toEqual(verificationCodeFixture);
    });
  });

  describe("deleteByCode", () => {
    it("should delete by code correctly", async () => {
      mockQueryDB.mockResolvedValueOnce([verificationCodeFixture]);

      const result = await repository.deleteByCode("code");

      expect(mockQueryDB).toHaveBeenCalledWith(
        "DELETE FROM verification_codes WHERE code = $1 RETURNING *",
        ["code"]
      );
      expect(result).toEqual(verificationCodeFixture);
    });
  });

  describe("deleteById", () => {
    it("should delete by id correctly", async () => {
      mockQueryDB.mockResolvedValueOnce([verificationCodeFixture]);

      const result = await repository.deleteById("id");

      expect(mockQueryDB).toHaveBeenCalledWith(
        "DELETE FROM verification_codes WHERE id = $1 RETURNING *",
        ["id"]
      );
      expect(result).toEqual(verificationCodeFixture);
    });
  });

  it("should use transactionQuery if provided in options", async () => {
    const mockTransactionQuery = vi
      .fn()
      .mockResolvedValueOnce([verificationCodeFixture]);

    await repository.create(verificationCodeFixture, {
      transactionQuery: mockTransactionQuery,
    });

    expect(mockTransactionQuery).toHaveBeenCalled();
  });
});
