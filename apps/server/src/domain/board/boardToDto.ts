import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "./IBoard.js";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

function boardToDto(board: iClientBoard): BoardDto {
  return {
    id: board.id,
    title: board.title,
    status: board.status,
    created_at: board.created_at,
    board_role: board.board_role,
    is_favorite: board.is_favorite,
  };
}

export type BoardToDto = typeof boardToDto;

export default boardToDto;
