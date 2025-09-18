import { describe, expect, it } from "vitest";
import { mockBoard } from "../../__fixtures__/board/index.js";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import boardToDto from "./boardToDto.js";

describe("boardToDto.ts", () => {
  it("should transform correctly", () => {
    const dto = boardToDto(mockBoard);

    const expectedDto: BoardDto = {
      id: mockBoard.id,
      title: mockBoard.title,
      status: mockBoard.status,
      created_at: mockBoard.created_at,
    };

    expect(dto).toEqual(expectedDto);
  });
});
