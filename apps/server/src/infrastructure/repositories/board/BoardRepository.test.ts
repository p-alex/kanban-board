import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardRepository from "./BoardRepository.js";
import { mockBoard } from "../../../__fixtures__/board/index.js";

describe("BoardRepository.ts", () => {
  let queryDb: Mock;
  let transactionQuery: Mock;
  let boardRepository: BoardRepository;

  beforeEach(() => {
    queryDb = vi.fn().mockResolvedValue([mockBoard]);
    transactionQuery = vi.fn().mockResolvedValue([mockBoard]);
    boardRepository = new BoardRepository(queryDb);
  });

  describe("findAllByUser", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findAllByUserId("user_id", {
        transactionQuery: undefined,
      });

      expect(queryDb).toHaveBeenCalledWith(
        "SELECT * FROM boards WHERE user_id = $1",
        ["user_id"]
      );
    });

    it("should use transaction query if passed", () => {
      boardRepository.findAllByUserId("user_id", { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.create(mockBoard, { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        "INSERT INTO boards (id, user_id, title, is_favorite, status, created_at, last_accessed_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          mockBoard.id,
          mockBoard.user_id,
          mockBoard.title,
          `${mockBoard.is_favorite}`,
          mockBoard.status,
          mockBoard.created_at,
          mockBoard.last_accessed_at,
        ]
      );
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.create(mockBoard, { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.update(mockBoard, { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        "UPDATE boards SET title = $1, status = $2, is_favorite = $3 WHERE id = $4 RETURNING *",
        [mockBoard.id]
      );
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.update(mockBoard, { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.delete(mockBoard, { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        "DELETE FROM boards WHERE id = $1 RETURNING *",
        [mockBoard.id]
      );
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.delete(mockBoard, { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });
});
