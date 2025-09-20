import IBoardMember from "./IBoardMember";

interface IBoard {
  id: string;
  title: string;
  isFavorite: boolean;
  boardRole: IBoardMember["role"];
  createdAt: string;
  isPrivate: boolean;
}

export default IBoard;
