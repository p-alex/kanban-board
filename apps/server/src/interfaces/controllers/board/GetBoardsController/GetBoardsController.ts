import { BoardDto, GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import AppException from "../../../../exceptions/AppException.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

class GetBoardsController {
  constructor(
    private readonly _boardRepository: BoardRepository,
    private readonly _boardTransformer: BoardTransformer,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest
  ): Promise<IHandlerResponse<GetBoardsResponseDto>> => {
    const user = httpReq.auth_user;

    if (!user)
      throw new AppException(401, ["Must be logged in"], "GetBoardsController");

    const boards =
      await this._boardRepository.findAllWhereMemberWithRoleAndIsFavorite(
        user.id,
        {}
      );

    const boardDtos: BoardDto[] = boards.map((board) =>
      this._boardTransformer.clientBoardToDto(board)
    );

    return {
      response: this._httpResponseFactory.success(200, { boardDtos }),
    };
  };
}

export default GetBoardsController;
