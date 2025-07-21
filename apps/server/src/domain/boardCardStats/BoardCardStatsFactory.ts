import IBoardCardStats from "./IBoardCardStats.js";

export type BoardCardStatsData = Pick<IBoardCardStats, "board_card_id">;

class BoardCardStatsFactory {
  constructor() {}

  create = (data: BoardCardStatsData): IBoardCardStats => {
    return {
      board_card_id: data.board_card_id,
      attachments: 0,
      checklist_items: 0,
      checklist_items_done: 0,
      has_description: false,
    };
  };
}

export default BoardCardStatsFactory;
