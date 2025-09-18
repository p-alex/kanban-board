import {
  GetBoardRequestDto,
  GetBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import { BoardToDto } from "../../../../domain/board/clientBoardToDto.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";

class GetBoardController {
  constructor(
    private readonly _boardRepository: BoardRepository,
    private readonly _boardMemberRepository: BoardMemberRepository,
    private readonly _favoriteBoardRepository: FavoriteBoardRepository,
    private readonly _boardToDto: BoardToDto,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<any, GetBoardRequestDto>
  ): Promise<IHandlerResponse<GetBoardResponseDto>> => {
    const user_id = httpReq.user.id;
    const board_id = httpReq.params.id;

    const board = await this._boardRepository.findById(board_id, {});

    if (!board) {
      throw new AppException(
        400,
        ["Board does not exist"],
        "GetBoardController"
      );
    }

    const boardMember = await this._boardMemberRepository.findOne(
      user_id,
      board_id,
      {}
    );

    const isMember = boardMember !== undefined;

    if (board.status === "private" && !isMember) {
      throw new AppException(
        403,
        ["This board is private"],
        "GetBoardController"
      );
    }

    const favoriteBoard = await this._favoriteBoardRepository.findOne(
      user_id,
      board_id,
      {}
    );

    const isFavorite = favoriteBoard !== undefined;

    const boardDto = this._boardToDto({
      ...board,
      board_role: isMember ? boardMember.role : "viewer",
      is_favorite: isFavorite,
    });

    return {
      response: this._httpResponseFactory.success(200, { boardDto }),
    };
  };
}

export default GetBoardController;
