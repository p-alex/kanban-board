import { BoardListDto } from "@kanban/dtos/BoardListDtoTypes";
import IBoardList from "../../domain/IBoardList";

class BoardListTransformer {
  static toDto = (boardList: IBoardList): BoardListDto => {
    return {
      id: boardList.id,
      board_id: boardList.boardId,
      title: boardList.title,
      index: boardList.index,
      created_at: boardList.created_at,
    };
  };
  static toBoardList = (boardListDto: BoardListDto): IBoardList => {
    return {
      id: boardListDto.id,
      boardId: boardListDto.board_id,
      title: boardListDto.title,
      index: boardListDto.index,
      created_at: boardListDto.created_at,
    };
  };
}

export default BoardListTransformer;
