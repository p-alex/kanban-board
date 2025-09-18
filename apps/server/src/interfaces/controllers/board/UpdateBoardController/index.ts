import boardToDto from "../../../../domain/board/boardToDto.js";
import dtoToBoard from "../../../../domain/board/dtoToBoard.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import boardRepository from "../../../../infrastructure/repositories/board/index.js";
import boardMemberRepository from "../../../../infrastructure/repositories/boardMember/index.js";
import UpdateBoardController from "./UpdateBoardController.js";

const updateBoardController = new UpdateBoardController(
  boardMemberRepository,
  boardRepository.update,
  dtoToBoard,
  boardToDto,
  httpResponseFactory.success
);

export default updateBoardController;
