import { isBoardActionAllowed } from "@kanban/shared/boardPermissions";
import checkIfBoardMemberCanPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/index.js";
import boardListTransformer from "../../../../domain/boardList/BoardListTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import boardListRepository from "../../../../infrastructure/repositories/boardList/index.js";
import GetBoardListsController from "./GetBoardListsController.js";

const getBoardListsController = new GetBoardListsController(
  boardRepository,
  isBoardActionAllowed,
  checkIfBoardMemberCanPerformActionOnBoardUsecase,
  boardListRepository,
  boardListTransformer,
  httpResponseFactory
);

export default getBoardListsController;
