import { describe, expect, it } from "vitest";
import boardToDto from "./boardToDto.js";
import { mockBoard } from "../../__fixtures__/board/index.js";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";

describe("boardToDto.ts", () => {
  it("should transform correctly", () => {
    const dto = boardToDto(mockBoard);

    const expectedDto: BoardDto = {
      id: mockBoard.id,
      user_id: mockBoard.user_id,
      title: mockBoard.title,
      status: mockBoard.status,
      is_favorite: mockBoard.is_favorite,
      created_at: mockBoard.created_at,
      last_accessed_at: mockBoard.last_accessed_at,
    };

    expect(dto).toEqual(expectedDto);
  });
});
