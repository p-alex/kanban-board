import IBoardColumn from "../boardList/IBoardList.js";

interface IBoardCardStats {
  board_card_id: IBoardColumn["id"];
  attachments: number;
  has_description: boolean;
  checklist_items: number;
  checklist_items_done: number;
}

export default IBoardCardStats;
