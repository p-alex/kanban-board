import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

function dtoToClientBoard(clientBoard: BoardDto): iClientBoard {
  return {
    id: clientBoard.id,
    title: clientBoard.title,
    status: clientBoard.status,
    created_at: clientBoard.created_at,
    board_role: clientBoard.board_role,
    is_favorite: clientBoard.is_favorite,
  };
}

export type DtoToClientBoard = typeof dtoToClientBoard;

export default dtoToClientBoard;
