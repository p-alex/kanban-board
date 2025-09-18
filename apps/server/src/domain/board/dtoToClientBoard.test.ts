import { describe, expect, it } from "vitest";
import { mockClientBoard } from "../../__fixtures__/board/index.js";
import dtoToBoard from "./dtoToClientBoard.js";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

describe("dtoToClientBoard.ts", () => {
  it("should transform correctly", () => {
    const board = dtoToBoard(mockClientBoard);

    const expectedBoard: iClientBoard = {
      id: mockClientBoard.id,
      title: mockClientBoard.title,
      status: mockClientBoard.status,
      is_favorite: mockClientBoard.is_favorite,
      board_role: mockClientBoard.board_role,
      created_at: mockClientBoard.created_at,
    };

    expect(board).toEqual(expectedBoard);
  });
});
