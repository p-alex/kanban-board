import { DateUtil } from "@kanban/utils";
import IBoardMember from "./IBoardMember.js";

export type BoardMemberFactoryData = Pick<
  IBoardMember,
  "user_id" | "board_id" | "role"
>;

class BoardMemberFactory {
  constructor(private readonly _date: DateUtil) {}

  create = (data: BoardMemberFactoryData): IBoardMember => {
    return {
      user_id: data.user_id,
      board_id: data.board_id,
      role: data.role,
      joined_at: this._date.getUtcOfNow(),
    };
  };
}

export default BoardMemberFactory;
