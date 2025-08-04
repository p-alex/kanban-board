interface IBoard {
  id: string;
  user_id: string;
  title: string;
  lastAccessedAt: string;
  isFavorite: boolean;
  createdAt: string;
  status: "public" | "private";
}

export default IBoard;
