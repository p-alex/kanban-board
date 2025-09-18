interface IBoard {
  id: string;
  title: string;
  status: "public" | "private";
  created_at: string;
}

export default IBoard;
