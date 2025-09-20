import IBoard from "./IBoard.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type BoardFactoryData = Pick<IBoard, "title" | "is_private">;

class BoardFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardFactoryData): IBoard => {
    return {
      id: this._randomUUID(),
      title: data.title,
      is_private: data.is_private,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardFactory;
