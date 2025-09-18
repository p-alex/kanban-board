import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../domain/IBoard";

class BoardTransformer {
  static dtoToBoard = (boardDto: BoardDto): IBoard => {
    return {
      id: boardDto.id,
      title: boardDto.title,
      status: boardDto.status,
      boardRole: boardDto.board_role,
      isFavorite: boardDto.is_favorite,
      createdAt: boardDto.created_at,
    };
  };

  static boardToDto = (board: IBoard): BoardDto => {
    return {
      id: board.id,
      title: board.title,
      status: board.status,
      board_role: board.boardRole,
      is_favorite: board.isFavorite,
      created_at: board.createdAt,
    };
  };
}

export default BoardTransformer;
