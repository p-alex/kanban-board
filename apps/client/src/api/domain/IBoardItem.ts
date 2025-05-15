import IBoardColumn from "./BoardColumn";

interface IBoardItem {
  id: string;
  columnId: IBoardColumn["id"];
  title: string;
  description: string;
  status: IBoardColumn["title"];
  totalSubTasks: number;
  completedSubTasks: number;
  index: number;
  createdAt: string;
}

export default IBoardItem;
