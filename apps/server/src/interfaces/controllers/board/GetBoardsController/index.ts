import boardToDto from "../../../../domain/board/boardToDto.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import GetBoardsController from "./GetBoardsController.js";

const getBoardsController = new GetBoardsController(
  boardRepository,
  boardToDto,
  httpResponseFactory
);

export default getBoardsController;
