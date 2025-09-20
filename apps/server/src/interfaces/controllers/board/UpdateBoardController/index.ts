import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import UpdateBoardController from "./UpdateBoardController.js";

const updateBoardController = new UpdateBoardController(
  boardMemberRepository,
  boardRepository.update,
  boardTransformer,
  httpResponseFactory.success
);

export default updateBoardController;
