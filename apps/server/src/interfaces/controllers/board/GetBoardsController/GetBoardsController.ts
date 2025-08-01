import { BoardDto, GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../../../domain/board/IBoard.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import AppException from "../../../../exceptions/AppException.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import { BoardToDto } from "../../../../domain/board/boardToDto.js";

class GetBoardsController {
  constructor(
    private readonly _boardRepository: BoardRepository,
    private readonly _boardToDto: BoardToDto,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest
  ): Promise<IHandlerResponse<GetBoardsResponseDto>> => {
    const user = httpReq.user;

    if (!user) throw new AppException(401, ["Must be logged in"]);

    const boards = await this._boardRepository.findAllByUserId(user.id, {});

    const boardDtos: BoardDto[] = boards.map((board) =>
      this._boardToDto(board)
    );

    return {
      response: this._httpResponseFactory.success(200, { boardDtos }),
    };
  };
}

export default GetBoardsController;
