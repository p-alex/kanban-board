import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import GetBoardsController from "./GetBoardsController.js";
import {
  IHandlerResponse,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import AppException from "../../../../exceptions/AppException.js";
import {
  mockBoard,
  mockBoardDto,
} from "../../../../__fixtures__/board/index.js";
import { GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

describe("GetBoardsController.ts", () => {
  let httpReqMock: IHttpRequest;

  let boardRepository: Mocked<BoardRepository>;
  let boardTransformerMock: Mocked<BoardTransformer>;
  let httpResponseFactory: Mocked<HttpResponseFactory>;

  let getBoardsController: GetBoardsController;

  beforeEach(() => {
    httpReqMock = { auth_user: { id: "id" } } as IHttpRequest;
    boardRepository = {
      findAllWhereMemberWithRoleAndIsFavorite: vi
        .fn()
        .mockResolvedValue([mockBoard, mockBoard]),
    } as unknown as Mocked<BoardRepository>;

    boardTransformerMock = {
      clientBoardToDto: vi.fn().mockReturnValue(mockBoardDto),
    } as unknown as Mocked<BoardTransformer>;

    httpResponseFactory = {
      success: vi.fn(),
    } as unknown as Mocked<HttpResponseFactory>;

    getBoardsController = new GetBoardsController(
      boardRepository,
      boardTransformerMock,
      httpResponseFactory
    );
  });

  it("should throw AppException with correct arguments if user is undefined in http request", async () => {
    httpReqMock.auth_user = undefined as any;
    try {
      await getBoardsController.handle(httpReqMock);
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors).toEqual(["Must be logged in"]);
      }
    }
  });

  it("should call boardRepository with correct arguments", async () => {
    await getBoardsController.handle(httpReqMock);

    expect(
      boardRepository.findAllWhereMemberWithRoleAndIsFavorite
    ).toHaveBeenCalledWith("id", {});
  });

  it("should transform each board to boardDto", async () => {
    await getBoardsController.handle(httpReqMock);

    expect(boardTransformerMock.clientBoardToDto).toHaveBeenCalledTimes(2);
    expect(boardTransformerMock.clientBoardToDto).toHaveBeenCalledWith(
      mockBoard
    );
  });

  it("should call httpResponseFactory with correct arguments", async () => {
    await getBoardsController.handle(httpReqMock);

    expect(httpResponseFactory.success).toHaveBeenCalledWith(200, {
      boardDtos: [mockBoardDto, mockBoardDto],
    });
  });

  it("should return the correct result", async () => {
    const mockHttpResponse: IHttpResponse<GetBoardsResponseDto> = {
      code: 200,
      errors: [],
      result: { boardDtos: [mockBoardDto, mockBoardDto] },
      success: true,
    };

    httpResponseFactory.success.mockReturnValue(mockHttpResponse);

    const result = await getBoardsController.handle(httpReqMock);

    const expectedResult: IHandlerResponse<GetBoardsResponseDto> = {
      response: mockHttpResponse,
    };

    expect(result).toEqual(expectedResult);
  });
});
