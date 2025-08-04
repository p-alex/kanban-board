import { describe, expect, it } from "vitest";
import { mockBoard, mockBoardDto } from "../../__fixtures__/board/index.js";
import IBoard from "./IBoard.js";
import dtoToBoard from "./dtoToBoard.js";

describe("dtoToBoard.ts", () => {
  it("should transform correctly", () => {
    const board = dtoToBoard(mockBoardDto);

    const expectedBoard: IBoard = {
      id: mockBoard.id,
      user_id: mockBoard.user_id,
      title: mockBoard.title,
      status: mockBoard.status,
      is_favorite: mockBoard.is_favorite,
      created_at: mockBoard.created_at,
      last_accessed_at: mockBoard.last_accessed_at,
    };

    expect(board).toEqual(expectedBoard);
  });
});
