import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import CreateBoardService from "../../../../application/services/board/CreateBoardService.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

class CreateBoardController {
  constructor(
    private readonly _createBoardService: CreateBoardService,
    private readonly _boardTransformer: BoardTransformer,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<CreateBoardRequestDto>
  ): Promise<IHandlerResponse<CreateBoardResponseDto>> => {
    const boardData = httpReq.body;
    const user_id = httpReq.user.id;

    const board = await this._createBoardService.execute(boardData, user_id);

    const boardDto = this._boardTransformer.clientBoardToDto(board);

    return {
      response: this._httpResponseFactory.success(200, {
        boardDto,
      }),
    };
  };
}

export default CreateBoardController;
