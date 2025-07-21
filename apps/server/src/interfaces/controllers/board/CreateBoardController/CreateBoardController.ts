import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import CreateBoardUsecase from "../../../../application/usecases/board/CreateBoardUsecase/CreateBoardUsecase.js";
import { BoardToDto } from "../../../../domain/board/boardToDto.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class CreateBoardController {
  constructor(
    private readonly _createBoardUsecase: CreateBoardUsecase,
    private readonly _boardToDto: BoardToDto,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<CreateBoardRequestDto>
  ): Promise<IHandlerResponse<CreateBoardResponseDto>> => {
    const boardData = httpReq.body;

    const board = await this._createBoardUsecase.execute(boardData);

    const boardDto = this._boardToDto(board);

    return {
      response: this._httpResponseFactory.success(200, {
        boardDto,
      }),
    };
  };
}

export default CreateBoardController;
