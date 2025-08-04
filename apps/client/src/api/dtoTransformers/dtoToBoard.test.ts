import { describe, expect, it } from "vitest";
import dtoToBoard from "./dtoToBoard.js";
import { boardDtoMock } from "../../__fixtures__/board/index.js";
import IBoard from "../domain/IBoard.js";

describe("dtoToBoard.ts", () => {
  it("should convert correctly", () => {
    const result = dtoToBoard(boardDtoMock);

    const expectedResult: IBoard = {
      id: boardDtoMock.id,
      user_id: boardDtoMock.user_id,
      title: boardDtoMock.title,
      status: boardDtoMock.status,
      isFavorite: boardDtoMock.is_favorite,
      createdAt: boardDtoMock.created_at,
      lastAccessedAt: boardDtoMock.last_accessed_at,
    };

    expect(result).toEqual(expectedResult);
  });
});
