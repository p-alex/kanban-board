import createBoardService from "../../../../application/services/board/index.js";
import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import CreateBoardController from "./CreateBoardController.js";

const createBoardController = new CreateBoardController(
  createBoardService,
  boardTransformer,
  httpResponseFactory
);

export default createBoardController;
