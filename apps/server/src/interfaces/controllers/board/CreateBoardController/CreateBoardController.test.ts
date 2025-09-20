import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import CreateBoardController from "./CreateBoardController.js";
import {
  IHandlerResponse,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import { CreateBoardRequestDto } from "@kanban/dtos/BoardDtoTypes";
import {
  mockBoard,
  mockBoardDto,
  mockClientBoardDto,
} from "../../../../__fixtures__/board/index.js";
import CreateBoardService from "../../../../application/services/board/CreateBoardService.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

describe("CreateBoardController.ts", () => {
  let createBoardService: Mocked<CreateBoardService>;

  let boardTransformer: Mocked<BoardTransformer>;

  let httpResponseFactory: Mocked<HttpResponseFactory>;

  let createBoardController: CreateBoardController;

  let mockHttpReq: IHttpRequest<CreateBoardRequestDto>;

  const mockHttpResponse: IHttpResponse<null> = {
    code: 200,
    errors: [],
    result: null,
    success: true,
  };

  beforeEach(() => {
    mockHttpReq = {
      body: {
        title: "title",
        is_private: false,
        user_id: "user_id",
      },
      user: {
        id: "id",
      },
    } as unknown as IHttpRequest;

    createBoardService = {
      execute: vi.fn().mockResolvedValue(mockBoard),
    } as unknown as Mocked<CreateBoardService>;

    boardTransformer = {
      clientBoardToDto: vi.fn().mockReturnValue(mockClientBoardDto),
    } as unknown as Mocked<BoardTransformer>;

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as Mocked<HttpResponseFactory>;

    createBoardController = new CreateBoardController(
      createBoardService,
      boardTransformer,
      httpResponseFactory
    );
  });

  it("should call create board usecase with correct arguments", async () => {
    await createBoardController.handle(mockHttpReq);

    expect(createBoardService.execute).toHaveBeenCalledWith(
      mockHttpReq.body,
      mockHttpReq.user.id
    );
  });

  it("should convert the created board into a board dto", async () => {
    await createBoardController.handle(mockHttpReq);

    expect(boardTransformer.clientBoardToDto).toHaveBeenCalledWith(mockBoard);
  });

  it("should call httpResponseFactory with correct arguments", async () => {
    await createBoardController.handle(mockHttpReq);

    expect(httpResponseFactory.success).toHaveBeenCalledWith(200, {
      boardDto: mockBoardDto,
    });
  });

  it("should return the correct object", async () => {
    const result = await createBoardController.handle(mockHttpReq);

    const expectedResult: IHandlerResponse<null> = {
      response: mockHttpResponse,
    };

    expect(result).toEqual(expectedResult);
  });
});
