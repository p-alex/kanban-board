import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";
import AppException from "../../../../exceptions/AppException.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";

class CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase {
  constructor(
    private readonly _boardMemberRepository: BoardMemberRepository,
    private readonly _isBoardActionAllowed: IsBoardActionAllowed
  ) {}

  execute = async (
    user_id: string,
    board_id: string,
    permission: BoardPermission
  ) => {
    const boardMember = await this._boardMemberRepository.findOne(
      user_id,
      board_id,
      {}
    );

    if (!boardMember) {
      throw new AppException(
        403,
        [
          `Can't perform '${permission}' because the user is not a member of this board`,
        ],
        "CheckIfBoardMemberCanPerformActionOnBoardUsecase"
      );
    }

    const isAllowed = this._isBoardActionAllowed(boardMember.role, permission);

    if (!isAllowed) {
      throw new AppException(
        403,
        [
          `Board member with role of ${boardMember.role} is not allowed to perform ${permission} on this board`,
        ],
        "CheckIfBoardMemberCanPerformActionOnBoardUsecase"
      );
    }

    return boardMember;
  };
}

export default CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase;
