import { BoardListDto } from "@kanban/dtos/BoardListDtoTypes";
import IBoardList from "../IBoardList.js";

class BoardListTransformer {
  constructor() {}

  toDto = (boardList: IBoardList): BoardListDto => {
    return {
      id: boardList.id,
      board_id: boardList.board_id,
      title: boardList.title,
      index: boardList.index,
      created_at: boardList.created_at,
    };
  };

  toBoardList = (boardListDto: BoardListDto): IBoardList => {
    return {
      id: boardListDto.id,
      board_id: boardListDto.board_id,
      title: boardListDto.title,
      index: boardListDto.index,
      created_at: boardListDto.created_at,
    };
  };
}

export default BoardListTransformer;
