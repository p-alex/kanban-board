import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

function dtoToBoard(boardDto: BoardDto): iClientBoard {
  return {
    id: boardDto.id,
    title: boardDto.title,
    status: boardDto.status,
    created_at: boardDto.created_at,
    board_role: boardDto.board_role,
    is_favorite: boardDto.is_favorite,
  };
}

export type DtoToBoard = typeof dtoToBoard;

export default dtoToBoard;
