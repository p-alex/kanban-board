import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import GetPublicBoardController from "./GetPublicBoardController.js";

const getPublicBoardController = new GetPublicBoardController(
  boardRepository,
  boardTransformer
);

export default getPublicBoardController;
