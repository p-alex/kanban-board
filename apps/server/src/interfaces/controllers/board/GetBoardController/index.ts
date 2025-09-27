import { isBoardActionAllowed } from "@kanban/shared/boardPermissions";
import boardTransformer from "../../../../domain/board/BoardTransformer/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import GetBoardController from "./GetBoardController.js";
import favoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/index.js";

const getBoardController = new GetBoardController(
  isBoardActionAllowed,
  boardRepository,
  boardMemberRepository,
  favoriteBoardRepository,
  boardTransformer,
  httpResponseFactory
);

export default getBoardController;
