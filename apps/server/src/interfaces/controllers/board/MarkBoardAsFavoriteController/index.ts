import favoriteBoardFactory from "../../../../domain/favoriteBoard/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";
import MarkBoardAsFavoriteController from "./MarkBoardAsFavoriteController.js";

const markBoardAsFavoriteController = new MarkBoardAsFavoriteController(
  favoriteBoardFactory,
  favoriteBoardRepository,
  boardMemberRepository,
  httpResponseFactory
);

export default markBoardAsFavoriteController;
