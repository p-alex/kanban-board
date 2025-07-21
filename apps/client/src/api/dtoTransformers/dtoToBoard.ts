import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../domain/IBoard";

function dtoToBoard(boardDto: BoardDto): IBoard {
  return {
    id: boardDto.id,
    title: boardDto.title,
    status: boardDto.status,
    isFavorite: boardDto.is_favorite,
    lastAccessedAt: boardDto.last_accessed_at,
  };
}

export type DtoToBoard = typeof dtoToBoard;

export default dtoToBoard;
