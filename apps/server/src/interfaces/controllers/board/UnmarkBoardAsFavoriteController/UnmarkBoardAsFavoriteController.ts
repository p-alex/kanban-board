import { UnmarkBoardAsFavoriteRequestDto } from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";

class UnmarkBoardAsFavoriteController {
  constructor(
    private readonly _favoriteBoardRepository: FavoriteBoardRepository,
    private readonly _boardMemberRepository: BoardMemberRepository,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<UnmarkBoardAsFavoriteRequestDto>
  ): Promise<IHandlerResponse<null>> => {
    const user = httpReq.auth_user;
    const board_id = httpReq.params.board_id;

    if (!user)
      throw new AppException(
        401,
        ["Must be logged in"],
        "MarkBoardAsFavoriteController"
      );

    const boardMember = await this._boardMemberRepository.findOne(
      user.id,
      board_id,
      {}
    );

    if (!boardMember)
      throw new AppException(
        403,
        ["You are not a member of this board"],
        "MarkBoardAsFavorite"
      );

    await this._favoriteBoardRepository.delete(
      { user_id: user.id, board_id },
      {}
    );

    return {
      response: this._httpResponseFactory.success(200, null),
    };
  };
}

export default UnmarkBoardAsFavoriteController;
