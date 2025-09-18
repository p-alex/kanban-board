import { CryptoUtil, DateUtil } from "@kanban/utils";
import IBoardList from "./IBoardList.js";

export type BoardListData = Pick<IBoardList, "board_id" | "title" | "index">;

class BoardListFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardListData): IBoardList => {
    return {
      id: this._randomUUID(),
      board_id: data.board_id,
      title: data.title,
      index: data.index,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardListFactory;
