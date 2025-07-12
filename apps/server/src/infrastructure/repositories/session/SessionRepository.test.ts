import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import SessionRepository from "./SessionRepository.js";
import { sessionMock } from "../../../domain/session/index.js";

describe("SessionRepository", () => {
  let queryDbMock: Mock;
  let repository: SessionRepository;

  beforeEach(() => {
    queryDbMock = vi.fn();
    repository = new SessionRepository(queryDbMock);
  });

  describe("findByToken", () => {
    it("should call queryDb with correct SQL and parameters", async () => {
      queryDbMock.mockResolvedValue([sessionMock]);

      const result = await repository.findByToken("token-abc", {});

      expect(queryDbMock).toHaveBeenCalledWith(
        "SELECT * FROM sessions WHERE token = $1",
        ["token-abc"]
      );
      expect(result).toEqual(sessionMock);
    });

    it("should use transactionQuery if provided in options", async () => {
      const transactionQuery = vi.fn().mockResolvedValue([sessionMock]);

      const result = await repository.findByToken("token-abc", {
        transactionQuery,
      });

      expect(transactionQuery).toHaveBeenCalledWith(
        "SELECT * FROM sessions WHERE token = $1",
        ["token-abc"]
      );
      expect(result).toEqual(sessionMock);
    });
  });

  describe("create", () => {
    it("should insert a session and return the created session", async () => {
      queryDbMock.mockResolvedValue([sessionMock]);

      const result = await repository.create(sessionMock, {});

      expect(queryDbMock).toHaveBeenCalledWith(
        "INSERT INTO sessions (id, user_id, token, created_at, last_accessed_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          sessionMock.id,
          sessionMock.user_id,
          sessionMock.token,
          sessionMock.created_at,
          sessionMock.last_accessed_at,
          sessionMock.expires_at,
        ]
      );
      expect(result).toEqual(sessionMock);
    });
  });

  describe("update", () => {
    it("should update a session and return the updated session", async () => {
      queryDbMock.mockResolvedValue([sessionMock]);

      const result = await repository.update(sessionMock, {});

      expect(queryDbMock).toHaveBeenCalledWith(
        "UPDATE sessions SET token = $1, last_accessed_at = $2 WHERE id = $3",
        [sessionMock.token, sessionMock.last_accessed_at, sessionMock.id]
      );
      expect(result).toEqual(sessionMock);
    });
  });

  describe("deleteByToken", () => {
    it("should delete a session by token and return the deleted session", async () => {
      queryDbMock.mockResolvedValue([sessionMock]);

      const result = await repository.deleteByToken("token-abc", {});

      expect(queryDbMock).toHaveBeenCalledWith(
        "DELETE FROM sessions WHERE token = $1 RETURNING *",
        ["token-abc"]
      );
      expect(result).toEqual(sessionMock);
    });
  });

  describe("getQueryFunction", () => {
    it("should use transactionQuery if provided", () => {
      const transactionQuery = vi.fn();
      const result = repository["getQueryFunction"]({ transactionQuery });

      expect(result).toBe(transactionQuery);
    });

    it("should fallback to _queryDB if no transactionQuery", () => {
      const result = repository["getQueryFunction"]({});
      expect(result).toBe(queryDbMock);
    });
  });
});
