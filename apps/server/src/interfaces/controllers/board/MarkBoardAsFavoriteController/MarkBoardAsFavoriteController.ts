import { MarkBoardAsFavoriteRequestDto } from "@kanban/dtos/BoardDtoTypes";
import FavoriteBoardFactory from "../../../../domain/favoriteBoard/FavoriteBoardFactory.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import AppException from "../../../../exceptions/AppException.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";

class MarkBoardAsFavoriteController {
  constructor(
    private readonly _favoriteBoardFactory: FavoriteBoardFactory,
    private readonly _favoriteBoardRepository: FavoriteBoardRepository,
    private readonly _boardMemberRepository: BoardMemberRepository,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<MarkBoardAsFavoriteRequestDto>
  ): Promise<IHandlerResponse<null>> => {
    const user = httpReq.auth_user;
    const board_id = httpReq.params.board_id;

    if (!user)
      throw new AppException(
        400,
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

    const newFavoriteBoard = this._favoriteBoardFactory.create({
      user_id: user.id,
      board_id,
    });

    await this._favoriteBoardRepository.create(newFavoriteBoard, {});

    return {
      response: this._httpResponseFactory.success(200, null),
    };
  };
}

export default MarkBoardAsFavoriteController;
