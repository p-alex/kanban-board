import boardFactory from "../../../../domain/board/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import createBoardMemberUsecase from "../../boardMember/CreateBoardMemberUsecase/index.js";
import CreateBoardUsecase from "./CreateBoardUsecase.js";

const createBoardUsecase = new CreateBoardUsecase(
  boardFactory,
  boardRepository
);

export default createBoardUsecase;
