import {
  UpdateBoardRequestDto,
  UpdateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";
import CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.js";
import { BoardPermission } from "@kanban/shared/boardPermissions";

class UpdateBoardController {
  constructor(
    private readonly _isBoardMemberAllowed: CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase,
    private readonly _updateBoard: BoardRepository["update"],
    private readonly _boardTransformer: BoardTransformer,
    private readonly _makeHttpSuccessResponse: HttpResponseFactory["success"]
  ) {}

  handle = async (
    httpReq: IHttpRequest<UpdateBoardRequestDto>
  ): Promise<IHandlerResponse<UpdateBoardResponseDto>> => {
    const user = httpReq.auth_user;

    if (!user)
      throw new AppException(
        400,
        ["Must be logged in"],
        "UpdateBoardController"
      );

    await this._isBoardMemberAllowed.execute(
      user.id,
      httpReq.body.toUpdateBoardDto.id,
      BoardPermission.UPDATE_BOARD
    );

    const boardToUpdate = this._boardTransformer.dtoToClientBoard(
      httpReq.body.toUpdateBoardDto
    );

    const updatedBoard = await this._updateBoard(boardToUpdate, {});

    const updatedBoardDto = this._boardTransformer.clientBoardToDto({
      ...boardToUpdate,
      ...updatedBoard,
    });

    return {
      response: this._makeHttpSuccessResponse(200, {
        updatedBoardDto,
      }),
    };
  };
}

export default UpdateBoardController;
