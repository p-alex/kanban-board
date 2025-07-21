interface IBoard {
  id: string;
  title: string;
  lastAccessedAt: string;
  isFavorite: boolean;
  status: "public" | "private";
}

export default IBoard;
