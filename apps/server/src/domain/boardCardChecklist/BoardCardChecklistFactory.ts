import { CryptoUtil, DateUtil } from "@kanban/utils";
import IBoardCardChecklist from "./IBoardCardChecklist.js";

export type BoardCardChecklistData = Pick<
  IBoardCardChecklist,
  "board_card_id" | "title" | "index"
>;

class BoardCardChecklistFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardCardChecklistData): IBoardCardChecklist => {
    return {
      id: this._randomUUID(),
      board_card_id: data.board_card_id,
      title: data.title,
      index: data.index,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardCardChecklistFactory;
