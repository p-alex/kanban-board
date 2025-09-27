import { isBoardActionAllowed } from "@kanban/shared/boardPermissions";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase from "./CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.js";

const checkIfBoardMemberCanPerformActionOnBoardUsecase =
  new CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase(
    boardMemberRepository,
    isBoardActionAllowed
  );

export default checkIfBoardMemberCanPerformActionOnBoardUsecase;
