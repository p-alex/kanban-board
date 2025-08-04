import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../domain/IBoard";

function boardToDto(board: IBoard): BoardDto {
  return {
    id: board.id,
    user_id: board.user_id,
    title: board.title,
    status: board.status,
    is_favorite: board.isFavorite,
    created_at: board.createdAt,
    last_accessed_at: board.lastAccessedAt,
  };
}

export type BoardToDto = typeof boardToDto;

export default boardToDto;
