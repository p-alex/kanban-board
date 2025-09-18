import IBoardMember from "./IBoardMember";

interface IBoard {
  id: string;
  title: string;
  isFavorite: boolean;
  boardRole: IBoardMember["role"];
  createdAt: string;
  status: "public" | "private";
}

export default IBoard;
