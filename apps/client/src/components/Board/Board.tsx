import IBoard from "../../api/domain/IBoard";
import BoardTopBar from "./BoardTopBar";

interface Props {
  board: IBoard;
}

export interface IList {
  id: string;
  title: string;
}

export interface ICard {
  id: string;
  listId: string;
  title: string;
  cover: string;
  isDone: boolean;
}

function Board({ board }: Props) {
  return (
    <div className="h-(--board_layout_height)">
      <BoardTopBar board={board} />
    </div>
  );
}

export default Board;
