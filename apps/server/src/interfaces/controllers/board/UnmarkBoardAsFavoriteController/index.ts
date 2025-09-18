import checkIfUserIsAMemberOfBoardUsecase from "../../../../application/usecases/boardMember/CheckIfUserIsAMemberOfBoardUsecase/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";
import UnmarkBoardAsFavoriteController from "./UnmarkBoardAsFavoriteController.js";

const unmarkBoardAsFavoriteController = new UnmarkBoardAsFavoriteController(
  favoriteBoardRepository,
  checkIfUserIsAMemberOfBoardUsecase,
  httpResponseFactory
);

export default unmarkBoardAsFavoriteController;
