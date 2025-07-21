import createBoardUsecase from "../../../../application/usecases/board/CreateBoardUsecase/index.js";
import boardToDto from "../../../../domain/board/boardToDto.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import CreateBoardController from "./CreateBoardController.js";

const createBoardController = new CreateBoardController(
  createBoardUsecase,
  boardToDto,
  httpResponseFactory
);

export default createBoardController;
