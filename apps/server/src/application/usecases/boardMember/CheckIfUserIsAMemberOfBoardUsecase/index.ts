import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import CheckIfUserIsAMemberOfBoardUsecase from "./CheckIfUserIsAMemberOfBoardUsecase.js";

const checkIfUserIsAMemberOfBoardUsecase =
  new CheckIfUserIsAMemberOfBoardUsecase(boardMemberRepository);

export default checkIfUserIsAMemberOfBoardUsecase;
