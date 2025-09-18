import checkIfUserIsAMemberOfBoardUsecase from "../../../../application/usecases/boardMember/CheckIfUserIsAMemberOfBoardUsecase/index.js";
import favoriteBoardFactory from "../../../../domain/favoriteBoard/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";
import MarkBoardAsFavoriteController from "./MarkBoardAsFavoriteController.js";

const markBoardAsFavoriteController = new MarkBoardAsFavoriteController(
  favoriteBoardFactory,
  favoriteBoardRepository,
  checkIfUserIsAMemberOfBoardUsecase,
  httpResponseFactory
);

export default markBoardAsFavoriteController;
