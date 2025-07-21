import { CryptoUtil, DateUtil } from "@kanban/utils";
import IBoardColumn from "./IBoardColumn.js";

export type BoardColumnData = Pick<
  IBoardColumn,
  "board_id" | "title" | "user_id" | "index"
>;

class BoardColumnFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardColumnData): IBoardColumn => {
    return {
      id: this._randomUUID(),
      board_id: data.board_id,
      user_id: data.user_id,
      title: data.title,
      index: data.index,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardColumnFactory;
