import {
  UpdateBoardRequestDto,
  UpdateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { DtoToBoard } from "../../../../domain/board/dtoToBoard.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import { BoardToDto } from "../../../../domain/board/boardToDto.js";

class UpdateBoardController {
  constructor(
    private readonly _updateBoard: BoardRepository["update"],
    private readonly _dtoToBoard: DtoToBoard,
    private readonly _boardToDto: BoardToDto,
    private readonly _makeHttpSuccessResponse: HttpResponseFactory["success"]
  ) {}

  handle = async (
    httpReq: IHttpRequest<UpdateBoardRequestDto>
  ): Promise<IHandlerResponse<UpdateBoardResponseDto>> => {
    const boardToUpdate = this._dtoToBoard(httpReq.body.toUpdateBoardDto);

    const updatedBoard = await this._updateBoard(boardToUpdate, {});

    const updatedBoardDto = this._boardToDto(updatedBoard);

    return {
      response: this._makeHttpSuccessResponse(200, {
        updatedBoardDto,
      }),
    };
  };
}

export default UpdateBoardController;
