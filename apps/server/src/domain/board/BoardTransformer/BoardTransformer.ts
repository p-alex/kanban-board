import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import { iClientBoard } from "../../../infrastructure/repositories/board/BoardRepository.js";

class BoardTransformer {
  constructor() {}

  clientBoardToDto = (board: iClientBoard): BoardDto => {
    return {
      id: board.id,
      title: board.title,
      board_role: board.board_role,
      is_private: board.is_private,
      is_favorite: board.is_favorite,
      created_at: board.created_at,
    };
  };

  dtoToClientBoard = (boardDto: BoardDto): iClientBoard => {
    return {
      id: boardDto.id,
      title: boardDto.title,
      board_role: boardDto.board_role,
      is_private: boardDto.is_private,
      is_favorite: boardDto.is_favorite,
      created_at: boardDto.created_at,
    };
  };
}

export default BoardTransformer;
