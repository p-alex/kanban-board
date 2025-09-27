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

  describe("findAllWhereMemberWithRoleAndIsFavorite", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findAllWhereMemberWithRoleAndIsFavorite("user_id", {
        transactionQuery: undefined,
      });

      expect(queryDb).toHaveBeenCalledWith(
        expect.stringContaining("from board_members bm"),
        ["user_id"]
      );
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.findAllWhereMemberWithRoleAndIsFavorite("user_id", {
        transactionQuery,
      });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("findByIdWhereMemberWithRoleAndIsFavorite", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findByIdWhereMemberWithRoleAndIsFavorite(
        "user_id",
        "board_id",
        { transactionQuery: undefined }
      );

      expect(queryDb).toHaveBeenCalledWith(
        expect.stringContaining("from boards b"),
        ["user_id", "board_id"]
      );
    });

    it("should return the first result", async () => {
      const result =
        await boardRepository.findByIdWhereMemberWithRoleAndIsFavorite(
          "user_id",
          "board_id",
          { transactionQuery: undefined }
        );

      expect(result).toEqual(mockBoard);
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.findByIdWhereMemberWithRoleAndIsFavorite(
        "user_id",
        "board_id",
        { transactionQuery }
      );

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findById("id", { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        expect.stringContaining("from boards"),
        ["id"]
      );
    });

    it("should return the first result", async () => {
      const result = await boardRepository.findById("id", {
        transactionQuery: undefined,
      });

      expect(result).toEqual(mockBoard);
    });

    it("should use transaction query if passed", async () => {
      await boardRepository.findById("id", { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.create(mockBoard, { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        "INSERT INTO boards (id, title, is_private, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          mockBoard.id,
          mockBoard.title,
          `${mockBoard.is_private}`,
          mockBoard.created_at,
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
        "UPDATE boards SET title = $1, is_private = $2 WHERE id = $3 RETURNING *",
        [mockBoard.title, `${mockBoard.is_private}`, mockBoard.id]
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
