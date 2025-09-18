import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import GetPublicBoardController from "./GetPublicBoardController.js";

const getPublicBoardController = new GetPublicBoardController(boardRepository);

export default getPublicBoardController;
