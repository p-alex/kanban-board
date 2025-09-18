import IBoard from "../board/IBoard.js";
import IUser from "../user/IUser.js";

interface IBoardMember {
  user_id: IUser["id"];
  board_id: IBoard["id"];
  role: "admin" | "member" | "viewer";
  joined_at: string;
}

export default IBoardMember;
