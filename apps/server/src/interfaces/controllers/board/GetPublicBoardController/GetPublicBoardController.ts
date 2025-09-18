import {
  GetPublicBoardRequestDto,
  GetPublicBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import {
  httpRequestFactory,
  IHandlerResponse,
  IHttpRequest,
} from "../../../adapter/index.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardToDto from "../../../../domain/board/clientBoardToDto.js";
import AppException from "../../../../exceptions/AppException.js";
import CheckIfUserIsAMemberOfBoardUsecase from "../../../../application/usecases/boardMember/CheckIfUserIsAMemberOfBoardUsecase/CheckIfUserIsAMemberOfBoardUsecase.js";

class GetPublicBoardController {
  constructor(private readonly _boardRepository: BoardRepository) {}

  handle = async (
    httpReq: IHttpRequest<GetPublicBoardRequestDto>
  ): Promise<IHandlerResponse<GetPublicBoardResponseDto>> => {
    const board_id = httpReq.params.id;

    let board = await this._boardRepository.findById(board_id, {});

    if (board.status === "private")
      throw new AppException(
        403,
        ["This board is private"],
        "GetPublicBoardController"
      );

    return {
      response: httpResponseFactory.success(200, {
        boardDto: boardToDto(board),
      }),
    };
  };
}

export default GetPublicBoardController;
