import IBoardItem from "./IBoardItem";

interface IBoardItemSubTask {
  id: string;
  itemId: IBoardItem["id"];
  title: string;
  isDone: boolean;
  createdAt: string;
}

export default IBoardItemSubTask;
