import IUser from "../user/IUser.js";

interface IBoard {
  id: string;
  user_id: IUser["id"];
  title: string;
  is_favorite: boolean;
  status: "public" | "private";
  created_at: string;
  last_accessed_at: string;
}

export default IBoard;
