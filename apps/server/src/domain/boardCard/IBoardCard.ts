import IBoardColumn from "../boardList/IBoardList.js";

interface IBoardCard {
  id: string;
  board_column_id: IBoardColumn["id"];
  is_done: boolean;
  title: string;
  description: string;
  cover: string | null;
  index: number;
  created_at: string;
}

export default IBoardCard;
