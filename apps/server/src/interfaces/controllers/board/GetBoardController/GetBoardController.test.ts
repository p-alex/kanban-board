import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import {
  GetBoardRequestDto,
  GetBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import GetBoardController from "./GetBoardController.js";
import boardToDto from "../../../../domain/board/clientBoardToDto.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import {
  mockBoard,
  mockBoardDto,
} from "../../../../__fixtures__/board/index.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";
import { mockBoardMember } from "../../../../__fixtures__/boardMember/index.js";
import { mockFavoriteBoard } from "../../../../__fixtures__/favoriteBoard/index.js";

describe("GetBoardController.ts", () => {
  let boardRepository: Mocked<BoardRepository>;
  let boardMemberRepository: Mocked<BoardMemberRepository>;
  let favoriteBoardRepository: Mocked<FavoriteBoardRepository>;
  let getBoardController: GetBoardController;

  const httpReq: Partial<IHttpRequest<any, GetBoardRequestDto>> = {
    params: { id: "id" },
    user: {
      id: "id",
    },
  };

  beforeEach(() => {
    boardRepository = {
      findById: vi.fn().mockResolvedValue(mockBoard),
    } as unknown as Mocked<BoardRepository>;

    boardMemberRepository = {
      findOne: vi.fn().mockResolvedValue(mockBoardMember),
    } as unknown as Mocked<BoardMemberRepository>;

    favoriteBoardRepository = {
      findOne: vi.fn().mockResolvedValue(mockFavoriteBoard),
    } as unknown as Mocked<FavoriteBoardRepository>;

    getBoardController = new GetBoardController(
      boardRepository,
      boardMemberRepository,
      favoriteBoardRepository,
      boardToDto,
      httpResponseFactory
    );
  });

  it("should call boardRepository.findById with correct arguments", async () => {
    await getBoardController.handle(httpReq as IHttpRequest);

    expect(boardRepository.findById).toHaveBeenCalledWith(
      httpReq.params?.id,
      {}
    );
  });

  it("return the correct response", async () => {
    const result = await getBoardController.handle(httpReq as IHttpRequest);

    const expectedResult: IHandlerResponse<GetBoardResponseDto> = {
      response: {
        code: 200,
        errors: [],
        result: {
          boardDto: mockBoardDto,
        },
        success: true,
      },
    };

    expect(result).toEqual(expectedResult);
  });
});
