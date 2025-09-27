import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";
import UnmarkBoardAsFavoriteController from "./UnmarkBoardAsFavoriteController.js";

const unmarkBoardAsFavoriteController = new UnmarkBoardAsFavoriteController(
  favoriteBoardRepository,
  boardMemberRepository,
  httpResponseFactory
);

export default unmarkBoardAsFavoriteController;
