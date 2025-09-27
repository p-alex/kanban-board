import checkIfBoardMemberCanPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/index.js";
import boardListTransformer from "../../../../domain/boardList/BoardListTransformer/index.js";
import boardListFactory from "../../../../domain/boardList/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardListRepository from "../../../../infrastructure/repositories/boardList/index.js";
import CreateBoardListController from "./CreateBoardListController.js";

const createBoardCardListController = new CreateBoardListController(
  checkIfBoardMemberCanPerformActionOnBoardUsecase,
  boardListFactory,
  boardListRepository,
  boardListTransformer,
  httpResponseFactory
);

export default createBoardCardListController;
