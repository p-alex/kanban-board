import {
  GetPublicBoardRequestDto,
  GetPublicBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";

class GetPublicBoardController {
  constructor(
    private readonly _boardRepository: BoardRepository,
    private readonly _boardTransformer: BoardTransformer
  ) {}

  handle = async (
    httpReq: IHttpRequest<GetPublicBoardRequestDto>
  ): Promise<IHandlerResponse<GetPublicBoardResponseDto>> => {
    const board_id = httpReq.params.id;

    let board = await this._boardRepository.findById(board_id, {});

    if (board.is_private)
      throw new AppException(
        403,
        ["This board is private"],
        "GetPublicBoardController"
      );

    return {
      response: httpResponseFactory.success(200, {
        boardDto: this._boardTransformer.clientBoardToDto(board),
      }),
    };
  };
}

export default GetPublicBoardController;
