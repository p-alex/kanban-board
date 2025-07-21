import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import CreateBoardUsecase from "../../../../application/usecases/board/CreateBoardUsecase/CreateBoardUsecase.js";
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
} from "../../../../__fixtures__/board/index.js";

describe("CreateBoardController.ts", () => {
  let createBoardUsecase: Mocked<CreateBoardUsecase>;

  let boardToDto: Mock;

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
        status: "public",
        user_id: "user_id",
      },
    } as unknown as IHttpRequest;

    createBoardUsecase = {
      execute: vi.fn().mockResolvedValue(mockBoard),
    } as unknown as Mocked<CreateBoardUsecase>;

    boardToDto = vi.fn().mockReturnValue(mockBoardDto);

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as Mocked<HttpResponseFactory>;

    createBoardController = new CreateBoardController(
      createBoardUsecase,
      boardToDto,
      httpResponseFactory
    );
  });

  it("should call create board usecase with correct arguments", async () => {
    await createBoardController.handle(mockHttpReq);

    expect(createBoardUsecase.execute).toHaveBeenCalledWith(mockHttpReq.body);
  });

  it("should convert the created board into a board dto", async () => {
    await createBoardController.handle(mockHttpReq);

    expect(boardToDto).toHaveBeenCalledWith(mockBoard);
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
