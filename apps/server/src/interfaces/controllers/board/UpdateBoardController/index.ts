import checkIfBoardMemberCanPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/index.js";
import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import UpdateBoardController from "./UpdateBoardController.js";

const updateBoardController = new UpdateBoardController(
  checkIfBoardMemberCanPerformActionOnBoardUsecase,
  boardRepository.update,
  boardTransformer,
  httpResponseFactory.success
);

export default updateBoardController;
