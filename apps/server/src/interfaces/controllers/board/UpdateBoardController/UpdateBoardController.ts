import {
  UpdateBoardRequestDto,
  UpdateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

class UpdateBoardController {
  constructor(
    private readonly _boardMembersRepository: BoardMemberRepository,
    private readonly _updateBoard: BoardRepository["update"],
    private readonly _boardTransformer: BoardTransformer,
    private readonly _makeHttpSuccessResponse: HttpResponseFactory["success"]
  ) {}

  handle = async (
    httpReq: IHttpRequest<UpdateBoardRequestDto>
  ): Promise<IHandlerResponse<UpdateBoardResponseDto>> => {
    const user = httpReq.user;

    if (!user)
      throw new AppException(
        400,
        ["Must be logged in"],
        "UpdateBoardController"
      );

    const boardMember = await this._boardMembersRepository.findOne(
      user.id,
      httpReq.body.toUpdateBoardDto.id,
      { transactionQuery: undefined }
    );

    if (!boardMember)
      throw new AppException(
        400,
        ["You must be a member of this board"],
        "UpdateBoardController"
      );

    if (boardMember.role !== "admin") {
      throw new AppException(
        400,
        ["You must be an admin to update the board"],
        "UpdateBoardController"
      );
    }

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
