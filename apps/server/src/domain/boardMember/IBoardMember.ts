import IBoard from "../board/IBoard.js";
import IUser from "../user/IUser.js";

import { BoardRole } from "@kanban/shared/boardPermissions";

interface IBoardMember {
  user_id: IUser["id"];
  board_id: IBoard["id"];
  role: BoardRole;
  joined_at: string;
}

export default IBoardMember;
