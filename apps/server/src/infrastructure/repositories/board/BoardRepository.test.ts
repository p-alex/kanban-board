import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardRepository from "./BoardRepository.js";
import {
  mockBoard,
  mockClientBoard,
} from "../../../__fixtures__/board/index.js";

describe("BoardRepository.ts", () => {
  let queryDb: Mock;
  let transactionQuery: Mock;
  let boardRepository: BoardRepository;

  beforeEach(() => {
    queryDb = vi.fn().mockResolvedValue([mockBoard]);
    transactionQuery = vi.fn().mockResolvedValue([mockBoard]);
    boardRepository = new BoardRepository(queryDb);
  });

  describe("findAllWhereMember", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findAllWhereMember("user_id", {
        transactionQuery: undefined,
      });

      expect(queryDb).toHaveBeenCalledWith(
        `
      select b.*, 
	exists(
		select 1 
		from favorite_boards fb 
		where fb.user_id = $1 
		and fb.board_id = bm.board_id
	) as is_favorite,
	(bm.user_id is not null) as is_member,
	(bm.role) as board_role
from board_members bm
left join boards b on b.id = bm.board_id
where bm.user_id = $1
`,
        ["user_id"]
      );
    });

    it("should use transaction query if passed", () => {
      boardRepository.findAllWhereMember("user_id", { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.findById("id", {
        transactionQuery: undefined,
      });

      expect(queryDb).toHaveBeenCalledWith(
        `
      select boards.*, false as is_favorite, 'viewer'::board_member_role as board_role
from boards
where boards.id = $1;
      `,
        ["id"]
      );
    });

    it("should use transaction query if passed", () => {
      boardRepository.findById("id", { transactionQuery });

      expect(transactionQuery).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should call queryFunc with correct arguments", async () => {
      await boardRepository.create(mockBoard, { transactionQuery: undefined });

      expect(queryDb).toHaveBeenCalledWith(
        "INSERT INTO boards (id, title, status, created_at) VALUES ($1, $2, $3, $4) RETURNING boards.*, (false) as is_favorite, ('admin') as board_role",
        [mockBoard.id, mockBoard.title, mockBoard.status, mockBoard.created_at]
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
        "UPDATE boards SET title = $1, status = $2 WHERE id = $3 RETURNING *",
        [mockBoard.title, mockBoard.status, mockBoard.id]
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
