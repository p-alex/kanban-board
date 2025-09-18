import boardMemberFactory from "../../../../domain/boardMember/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import CreateBoardMemberUsecase from "./CreateBoardMemberUsecase.js";

const createBoardMemberUsecase = new CreateBoardMemberUsecase(
  boardMemberFactory,
  boardMemberRepository
);

export default createBoardMemberUsecase;
