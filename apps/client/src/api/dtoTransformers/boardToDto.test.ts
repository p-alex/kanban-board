import { describe, expect, it } from "vitest";
import { boardMock } from "../../__fixtures__/board/index.js";
import boardToDto from "./boardToDto.js";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";

describe("boardToDto.ts", () => {
  it("should convert correctly", () => {
    const result = boardToDto(boardMock);

    const expectedResult: BoardDto = {
      id: result.id,
      user_id: result.user_id,
      title: result.title,
      status: result.status,
      created_at: result.created_at,
      is_favorite: result.is_favorite,
      last_accessed_at: result.last_accessed_at,
    };

    expect(result).toEqual(expectedResult);
  });
});
