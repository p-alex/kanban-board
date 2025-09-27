import IBoard from "../board/IBoard.js";

interface IBoardList {
  id: string;
  board_id: IBoard["id"];
  title: string;
  index: number;
  created_at: string;
}

export default IBoardList;
