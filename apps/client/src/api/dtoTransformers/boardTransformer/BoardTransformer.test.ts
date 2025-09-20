import { describe, expect, it } from "vitest";
import BoardTransformer from "./BoardTransformer.js";
import IBoard from "../../domain/IBoard.js";
import { boardDtoMock, boardMock } from "../../../__fixtures__/board/index.js";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";

describe("BoardTransformer.ts", () => {
  it("should transform from dto to board", () => {
    const result = BoardTransformer.dtoToBoard(boardDtoMock);

    const expectedResult: IBoard = {
      id: boardDtoMock.id,
      title: boardDtoMock.title,
      isPrivate: boardDtoMock.is_private,
      boardRole: boardDtoMock.board_role,
      createdAt: boardDtoMock.created_at,
      isFavorite: boardDtoMock.is_favorite,
    };

    expect(expectedResult).toEqual(result);
  });

  it("should transform from board to dto", () => {
    const result = BoardTransformer.boardToDto(boardMock);

    const expectedResult: BoardDto = {
      id: boardMock.id,
      title: boardMock.title,
      is_private: boardMock.isPrivate,
      board_role: boardMock.boardRole,
      created_at: boardMock.createdAt,
      is_favorite: boardMock.isFavorite,
    };

    expect(expectedResult).toEqual(result);
  });
});
