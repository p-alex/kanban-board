import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import CreateBoardService from "../../../../application/services/board/CreateBoardService.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";
import AppException from "../../../../exceptions/AppException.js";

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
    const user = httpReq.auth_user;

    if (!user)
      throw new AppException(
        401,
        ["Must be logged in"],
        "CreateBoardController"
      );

    const board = await this._createBoardService.execute(boardData, user.id);

    const boardDto = this._boardTransformer.clientBoardToDto({
      ...board,
      is_favorite: false,
      board_role: "admin",
    });

    return {
      response: this._httpResponseFactory.success(200, {
        boardDto,
      }),
    };
  };
}

export default CreateBoardController;
