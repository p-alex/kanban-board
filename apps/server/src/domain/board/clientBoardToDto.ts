import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

function boardToDto(clientBoard: iClientBoard): BoardDto {
  return {
    id: clientBoard.id,
    title: clientBoard.title,
    status: clientBoard.status,
    created_at: clientBoard.created_at,
    board_role: clientBoard.board_role,
    is_favorite: clientBoard.is_favorite,
  };
}

export type BoardToDto = typeof boardToDto;

export default boardToDto;
