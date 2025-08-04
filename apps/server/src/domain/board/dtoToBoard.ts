import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "./IBoard.js";

function dtoToBoard(board: BoardDto): IBoard {
  return {
    id: board.id,
    user_id: board.user_id,
    title: board.title,
    status: board.status,
    is_favorite: board.is_favorite,
    created_at: board.created_at,
    last_accessed_at: board.last_accessed_at,
  };
}

export type DtoToBoard = typeof dtoToBoard;

export default dtoToBoard;
