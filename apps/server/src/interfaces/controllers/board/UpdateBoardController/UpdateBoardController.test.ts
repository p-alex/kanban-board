import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UpdateBoardController from "./UpdateBoardController.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import {
  UpdateBoardRequestDto,
  UpdateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import {
  mockBoard,
  mockBoardDto,
} from "../../../../__fixtures__/board/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";

describe("UpdateBoardController.ts", () => {
  let updateBoard: Mock;
  let dtoToBoard: Mock;
  let boardToDto: Mock;

  let updateBoardController: UpdateBoardController;

  let httpReq: IHttpRequest<UpdateBoardRequestDto>;

  beforeEach(() => {
    updateBoard = vi.fn().mockResolvedValue(mockBoard);
    dtoToBoard = vi.fn().mockReturnValue(mockBoard);
    boardToDto = vi.fn().mockReturnValue(mockBoardDto);

    httpReq = {
      body: {
        toUpdateBoardDto: mockBoardDto,
      },
    } as unknown as IHttpRequest;

    updateBoardController = new UpdateBoardController(
      updateBoard,
      dtoToBoard,
      boardToDto,
      httpResponseFactory.success
    );
  });

  it("should tranform board dto to board", async () => {
    await updateBoardController.handle(httpReq);

    expect(dtoToBoard).toHaveBeenCalledWith(httpReq.body.toUpdateBoardDto);
  });

  it("should should update board by calling boardRepository.update with correct arguments", async () => {
    await updateBoardController.handle(httpReq);

    expect(updateBoard).toHaveBeenCalledWith(mockBoard, {});
  });

  it("should transform board to dto", async () => {
    await updateBoardController.handle(httpReq);

    expect(boardToDto).toHaveBeenCalledWith(mockBoard);
  });

  it("should return the correct result", async () => {
    const result = await updateBoardController.handle(httpReq);

    const expectedResult: IHandlerResponse<UpdateBoardResponseDto> = {
      response: {
        code: 200,
        errors: [],
        result: {
          updatedBoardDto: mockBoardDto,
        },
        success: true,
      },
    };

    expect(result).toEqual(expectedResult);
  });
});
