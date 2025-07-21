import { CryptoUtil, DateUtil } from "@kanban/utils";
import IBoardCardChecklistItem from "./IBoardCardChecklistItem.js";

type BoardCardChecklistItemData = Pick<
  IBoardCardChecklistItem,
  "title" | "board_checklist_id"
>;

class BoardCardChecklistItemFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardCardChecklistItemData): IBoardCardChecklistItem => {
    const now = this._getUtcOfNow();

    return {
      id: this._randomUUID(),
      board_checklist_id: data.board_checklist_id,
      title: data.title,
      is_done: false,
      index: 0,
      created_at: now,
    };
  };
}

export default BoardCardChecklistItemFactory;
