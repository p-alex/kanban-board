import { UnmarkBoardAsFavoriteRequestDto } from "@kanban/dtos/BoardDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import CheckIfUserIsAMemberOfBoardUsecase from "../../../../application/usecases/boardMember/CheckIfUserIsAMemberOfBoardUsecase/CheckIfUserIsAMemberOfBoardUsecase.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class UnmarkBoardAsFavoriteController {
  constructor(
    private readonly _favoriteBoardRepository: FavoriteBoardRepository,
    private readonly _checkIfUserIsMemberOfBoard: CheckIfUserIsAMemberOfBoardUsecase,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<UnmarkBoardAsFavoriteRequestDto>
  ): Promise<IHandlerResponse<null>> => {
    const user = httpReq.user;

    if (!user)
      throw new AppException(
        400,
        ["Must be logged in"],
        "MarkBoardAsFavoriteController"
      );

    const board_id = httpReq.params.board_id;

    await this._checkIfUserIsMemberOfBoard.execute(user.id, board_id);

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
