import IBoard from "./IBoard.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type BoardFactoryData = Pick<IBoard, "title" | "user_id" | "status">;

class BoardFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardFactoryData): IBoard => {
    return {
      id: this._randomUUID(),
      user_id: data.user_id,
      title: data.title,
      is_favorite: false,
      status: data.status,
      created_at: this._getUtcOfNow(),
      last_accessed_at: this._getUtcOfNow(),
    };
  };
}

export default BoardFactory;
