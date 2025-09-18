import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import CreateBoardService from "../../../../application/services/board/CreateBoardService.js";
import AppException from "../../../../exceptions/AppException.js";
import { BoardToDto } from "../../../../domain/board/clientBoardToDto.js";

class CreateBoardController {
  constructor(
    private readonly _createBoardService: CreateBoardService,
    private readonly _boardToDto: BoardToDto,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<CreateBoardRequestDto>
  ): Promise<IHandlerResponse<CreateBoardResponseDto>> => {
    const boardData = httpReq.body;
    const user_id = httpReq.user.id;

    const board = await this._createBoardService.execute(boardData, user_id);

    const boardDto = this._boardToDto(board);

    return {
      response: this._httpResponseFactory.success(200, {
        boardDto,
      }),
    };
  };
}

export default CreateBoardController;
