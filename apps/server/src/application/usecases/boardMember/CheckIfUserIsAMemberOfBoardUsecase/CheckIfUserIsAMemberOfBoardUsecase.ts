import IBoard from "../../../../domain/board/IBoard.js";
import IUser from "../../../../domain/user/IUser.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";

class CheckIfUserIsAMemberOfBoardUsecase {
  constructor(private readonly _boardMemberRepository: BoardMemberRepository) {}

  execute = async (user_id: IUser["id"], board_id: IBoard["id"]) => {
    const boardMember = await this._boardMemberRepository.findOne(
      user_id,
      board_id,
      {}
    );

    if (!boardMember)
      throw new AppException(
        400,
        ["You are not a member of the board"],
        "MarkBoardAsFavoriteController"
      );

    return true;
  };
}

export default CheckIfUserIsAMemberOfBoardUsecase;
