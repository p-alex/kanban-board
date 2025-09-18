import transactionManager from "../../../db/TransactionManager/index.js";
import createBoardUsecase from "../../usecases/board/CreateBoardUsecase/index.js";
import createBoardMemberUsecase from "../../usecases/boardMember/CreateBoardMemberUsecase/index.js";
import CreateBoardService from "./CreateBoardService.js";

const createBoardService = new CreateBoardService(
  transactionManager,
  createBoardUsecase,
  createBoardMemberUsecase
);

export default createBoardService;
