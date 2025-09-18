import createBoardService from "../../../../application/services/board/index.js";
import boardToDto from "../../../../domain/board/clientBoardToDto.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import CreateBoardController from "./CreateBoardController.js";

const createBoardController = new CreateBoardController(
  createBoardService,
  boardToDto,
  httpResponseFactory
);

export default createBoardController;
