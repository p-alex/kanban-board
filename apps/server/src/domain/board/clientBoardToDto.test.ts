import { describe, expect, it } from "vitest";
import { mockClientBoardDto } from "../../__fixtures__/board/index.js";
import clientBoardToDto from "./clientBoardToDto.js";
import { ClientBoardDto } from "../../../../../packages/dtos/dist/board/types/ClientBoardDto.js";

describe("clientBoardToDto.ts", () => {
  it("should transform correctly", () => {
    const dto = clientBoardToDto(mockClientBoardDto);

    const expectedDto: ClientBoardDto = {
      id: mockClientBoardDto.id,
      title: mockClientBoardDto.title,
      status: mockClientBoardDto.status,
      created_at: mockClientBoardDto.created_at,
      board_role: mockClientBoardDto.board_role,
      is_favorite: mockClientBoardDto.is_favorite,
    };

    expect(dto).toEqual(expectedDto);
  });
});
