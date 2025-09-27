import IBoardCard from "./IBoardCard.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type BoardCardData = Pick<
  IBoardCard,
  "title" | "index" | "board_list_id"
>;

class BoardCardFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardCardData): IBoardCard => {
    return {
      id: this._randomUUID(),
      board_list_id: data.board_list_id,
      title: data.title,
      index: data.index,
      description: "",
      cover: "",
      is_done: false,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardCardFactory;
