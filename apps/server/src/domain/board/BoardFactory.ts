import IBoard from "./IBoard.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type BoardFactoryData = Pick<IBoard, "title" | "status">;

class BoardFactory {
  constructor(
    private readonly _randomUUID: CryptoUtil["randomUUID"],
    private readonly _getUtcOfNow: DateUtil["getUtcOfNow"]
  ) {}

  create = (data: BoardFactoryData): IBoard => {
    return {
      id: this._randomUUID(),
      title: data.title,
      status: data.status,
      created_at: this._getUtcOfNow(),
    };
  };
}

export default BoardFactory;
