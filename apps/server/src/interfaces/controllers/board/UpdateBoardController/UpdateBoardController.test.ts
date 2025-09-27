import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
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
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";
import CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.js";

describe("UpdateBoardController.ts", () => {
  let updateBoard: Mock;
  let boardTransformer: Mocked<BoardTransformer>;
  let checkIfBoardMemberIsAllowedToPerformActionOnBoardUsecaseMock: Mocked<CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase>;

  let updateBoardController: UpdateBoardController;

  let httpReq: IHttpRequest<UpdateBoardRequestDto>;

  beforeEach(() => {
    checkIfBoardMemberIsAllowedToPerformActionOnBoardUsecaseMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase>;

    updateBoard = vi.fn().mockResolvedValue(mockBoard);

    boardTransformer = {
      dtoToClientBoard: vi.fn().mockReturnValue(mockBoard),
      clientBoardToDto: vi.fn().mockReturnValue(mockBoardDto),
    } as Mocked<BoardTransformer>;

    httpReq = {
      body: {
        toUpdateBoardDto: mockBoardDto,
      },
      auth_user: {
        id: "id",
      },
    } as unknown as IHttpRequest;

    updateBoardController = new UpdateBoardController(
      checkIfBoardMemberIsAllowedToPerformActionOnBoardUsecaseMock,
      updateBoard,
      boardTransformer,
      httpResponseFactory.success
    );
  });

  it("should transform board dto to board", async () => {
    await updateBoardController.handle(httpReq);

    expect(boardTransformer.dtoToClientBoard).toHaveBeenCalledWith(
      httpReq.body.toUpdateBoardDto
    );
  });

  it("should update board by calling boardRepository.update with correct arguments", async () => {
    await updateBoardController.handle(httpReq);

    expect(updateBoard).toHaveBeenCalledWith(mockBoard, {});
  });

  it("should transform board to dto", async () => {
    await updateBoardController.handle(httpReq);

    expect(boardTransformer.clientBoardToDto).toHaveBeenCalledWith({
      ...mockBoard,
      ...mockBoard,
    });
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
