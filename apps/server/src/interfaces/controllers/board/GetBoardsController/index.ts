import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import GetBoardsController from "./GetBoardsController.js";

const getBoardsController = new GetBoardsController(
  boardRepository,
  boardTransformer,
  httpResponseFactory
);

export default getBoardsController;
