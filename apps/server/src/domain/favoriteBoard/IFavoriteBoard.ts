import IBoard from "../board/IBoard.js";
import IUser from "../user/IUser.js";

interface IFavoriteBoard {
  user_id: IUser["id"];
  board_id: IBoard["id"];
}

export default IFavoriteBoard;
