import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";
import GetBoardController from "./GetBoardController.js";

const getBoardController = new GetBoardController(
  boardRepository,
  boardMemberRepository,
  favoriteBoardRepository,
  boardTransformer,
  httpResponseFactory
);

export default getBoardController;
